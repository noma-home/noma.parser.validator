import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { lastValueFrom } from "rxjs";

import { $Advert } from "@types";

@Injectable()
export class LocationService {
    private logger = new Logger(LocationService.name);
    public readonly baseURL: string;

    constructor(private readonly httpService: HttpService, private readonly config: ConfigService) {
        this.baseURL = this.config.get<string>("NOMA_ADVERT_API_URL");
    }

    private static stringToRegex(string: string): string {
        return string
            .replaceAll("i", "і")
            .toLowerCase()
            .replaceAll(".", "")
            .trim()
            .split(" ")
            .map((s) => `(?=.*${s})`)
            .join("");
    }

    /**
     * For a giving advert location data finds Noma Location Region
     * @param location {$Advert.$Location} - advert location data
     */
    public async getRegion(location: $Advert.$Location): Promise<string> {
        return "64b8005aa035cf999ea32b56";
    }

    /**
     * For a giving advert location data finds Noma Location SubRegion
     * @param location {$Advert.$Location} - advert location data
     */
    public async getSubRegion(location: $Advert.$Location) {
        if (location.settlement.toLowerCase().trim() === "Львів") {
            return "64b805287ef0324d7e81d1c6";
        }

        return null;
    }

    /**
     * For a giving advert location data finds Noma Location Settlement
     * @param location {$Advert.$Location} - advert location data
     */
    public async getSettlement(location: $Advert.$Location) {
        if (location.settlement.toLowerCase().trim() === "львів") {
            return "64c552e4eca4d39d102386ae";
        }

        return null;
    }

    /**
     * For a giving advert location data finds Noma Location District
     * @param location {$Advert.$Location} - advert location data
     */
    public async getDistrict(location: $Advert.$Location): Promise<string | null> {
        const { district } = location;

        if (district) {
            const regex = LocationService.stringToRegex(district.replace("район", ""));

            try {
                const response: AxiosResponse<{ _id: string }[]> = await lastValueFrom(
                    this.httpService.get(`${this.baseURL}/district`, { params: { regex } }),
                );

                if (response.data.length > 1) {
                    this.logger.error(`Location cast error: found more than one match for district ${district}`);
                } else if (response.data.length === 0) {
                    this.logger.error(`Location cast error: no matching districts for ${district}`);
                } else {
                    return response.data[0]._id;
                }
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * For a giving advert location data finds Noma Location Street
     * @param location {$Advert.$Location} - advert location data
     */
    public async getStreet(location: $Advert.$Location): Promise<string | null> {
        const { street } = location;

        if (street) {
            let type: string;

            if (street.includes("вул")) {
                type = "Вулиця";
            }

            if (street.includes("просп")) {
                type = "Проспект";
            }

            const regex = LocationService.stringToRegex(
                street.replace("вул", "").replace("вулиця", "").replace("просп", "").replace("проспект", ""),
            );

            try {
                const response: AxiosResponse<{ matches: string[] }> = await lastValueFrom(
                    this.httpService.get(`${this.baseURL}/street`, { params: { regex, type } }),
                );

                if (response.data.matches.length > 1) {
                    this.logger.error(`Location cast error: found more than one match for street ${street}`);
                } else if (response.data.matches.length === 0) {
                    this.logger.error(`Location cast error: no matching streets for ${street}`);
                } else {
                    return response.data.matches[0];
                }
            } catch (e) {
                return null;
            }
        }

        return null;
    }
}
