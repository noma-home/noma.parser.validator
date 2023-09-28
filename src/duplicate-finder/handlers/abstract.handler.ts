import { AdvertService } from "@advert";
import { HttpService } from "@nestjs/axios";

import { $DuplicateFinder } from "./interfaces";

/**
 * Represents an abstract handler in the Chain of Responsibility pattern.
 */
export abstract class AbstractHandler implements $DuplicateFinder.$Handler {
    private nextHandler?: $DuplicateFinder.$Handler;
    public readonly advertService: AdvertService;
    public readonly httpService: HttpService;

    /**
     * Sets the next handler in the chain.
     *
     * @param handler - The next handler to set in the chain.
     * @returns The next handler.
     */
    public setNext(handler: $DuplicateFinder.$Handler) {
        this.nextHandler = handler;
        return handler;
    }

    /**
     * Handles a request in the Chain of Responsibility.
     *
     * If a next handler exists, the request is passed to the next handler in the chain;
     * otherwise, the request is considered handled.
     *
     * @param request - The request to handle.
     * @returns The result of handling the request.
     */
    public handle(request: $DuplicateFinder.$Request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }

        return request;
    }
}
