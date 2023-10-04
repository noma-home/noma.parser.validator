import * as nodePath from "path";
import { firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { spawn } from "child_process";
import { createWriteStream } from "fs";
import { mkdir, rm } from "fs/promises";

import { AbstractHandler } from "./abstract.handler";
import { $DuplicateFinder } from "./interfaces";
import { AdvertService } from "@advert";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

/**
 * Represents a handler for processing image-related requests in the Chain of Responsibility.
 * Filters possible duplicates from previous steps by comparing images
 */
@Injectable()
export class ImageHandler extends AbstractHandler {
    constructor(public readonly advertService: AdvertService, public readonly httpService: HttpService) {
        super();
    }

    private static ComparerPath: string =
        "C:\\Users\\dev\\source\\repos\\ImageSimilarity\\ImageSimilarity\\bin\\Debug\\net7.0\\ImageSimilarity.exe";

    /**
     * Gets the number of image matches required for considering duplicates.
     *
     * @param n - The total number of images.
     * @returns The number of matches required.
     */
    private static getMatchesLimit(n: number) {
        return Math.ceil(n * 0.6);
    }

    /**
     * Downloads an image from a URL and saves it to a local path.
     *
     * @param url - The URL of the image to download.
     * @param path - The local path to save the downloaded image.
     */
    private async downloadImage(url: string, path: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    responseType: "stream",
                }),
            );
            const filename = `${uuidv4().toString()}.jpg`;
            const writeStream = await response.data.pipe(createWriteStream(nodePath.join(path, filename)));

            await new Promise((resolve, reject) => {
                writeStream.on("finish", resolve);
                writeStream.on("error", reject);
            });

            await writeStream.close();
        } catch (error) {
            throw new Error(`Failed to download image: ${error.message}`);
        }
    }

    /**
     * Downloads images associated with an advert from their URLs to a local directory.
     *
     * @param urls - An array of image URLs to download.
     * @param path - The local directory path to save the downloaded images.
     */
    private async downloadAdvertImages(urls: string[], path) {
        await Promise.all(
            urls.map(async (url) => {
                await this.downloadImage(url, path);
            }),
        );
    }

    /**
     * Compares two images using an external image comparison tool.
     *
     * @param method - The comparison method ("CompareMultiple" or "CompareTwo").
     * @param path1 - The path to the first image.
     * @param path2 - The path to the second image.
     * @returns A promise that resolves to whether the images match.
     */
    private async compare(method: "CompareMultiple" | "CompareTwo", path1: string, path2: string) {
        return new Promise((resolve, reject) => {
            let hasMatch;

            const path = ImageHandler.ComparerPath;

            const args = ["--method", method, "--in", path1, "--out", path2];

            const app = spawn(path, args);

            app.stdout.on("data", (data) => {
                const out = data.toString();
                hasMatch = eval(out.toLowerCase());
            });

            app.on("exit", (code) => {
                if (code === 0) {
                    resolve(hasMatch);
                } else {
                    reject(new Error(`Process exited with code ${code}.`));
                }
            });
        });
    }

    /**
     * Creates a temporary process directory for handling image comparisons.
     *
     * @returns An object containing the process directory path and advert images directory path.
     */
    private static async createProcessDir(): Promise<{ processPath: string; advertImagesPath: string }> {
        const processUUID = uuidv4().toString();
        const processPath = nodePath.join("tmp", processUUID);
        const advertImagesPath = nodePath.join(processPath, "advert");
        await mkdir(advertImagesPath, { recursive: true });
        return { processPath, advertImagesPath };
    }

    /**
     * Creates a directory for a duplicate advert within the process directory.
     *
     * @param processPath - The process directory path.
     * @param duplicateID - The ID of the duplicate advert.
     * @returns The path to the duplicate directory.
     */
    private static async createDuplicateDir(processPath: string, duplicateID: string) {
        const duplicatePath = nodePath.join(processPath, duplicateID);
        await mkdir(nodePath.join(processPath, duplicateID), { recursive: true });
        return duplicatePath;
    }

    /**
     * Handles an image-related request by comparing advert images to potential duplicates.
     *
     * @param request - The image-related request to handle.
     * @returns A promise that resolves to the handled request.
     */

    public async handle(request: $DuplicateFinder.$Request): Promise<$DuplicateFinder.$Request> {
        if (request.possibleDuplicates.length > 0) {
            const mismatched: string[] = [];
            const minMatchNumber = ImageHandler.getMatchesLimit(request.advert.images.length);
            const { processPath, advertImagesPath } = await ImageHandler.createProcessDir();
            await this.downloadAdvertImages(request.advert.images, advertImagesPath);

            for (let i = 0; i < request.possibleDuplicates.length; i++) {
                const duplicatePath = await ImageHandler.createDuplicateDir(processPath, request.possibleDuplicates[i]);
                const duplicate = await this.advertService.get(request.possibleDuplicates[i]);
                const images = duplicate.data.raw.images;
                await this.downloadAdvertImages(images, duplicatePath);
                const numberOfMatches = await this.compare("CompareMultiple", advertImagesPath, duplicatePath);

                if (numberOfMatches < minMatchNumber) {
                    mismatched.push(request.possibleDuplicates[i]);
                }
            }

            await rm(processPath, { recursive: true });

            request.possibleDuplicates.filter((id) => !mismatched.includes(id));
        }

        return super.handle(request);
    }
}
