import { $DuplicateFinder } from "./interfaces";
import { AdvertService } from "../../advert/advert.service";

export abstract class AbstractHandler implements $DuplicateFinder.$Handler {
  private nextHandler?: $DuplicateFinder.$Handler;
  public readonly advertService: AdvertService;

  public setNext(handler: $DuplicateFinder.$Handler) {
    this.nextHandler = handler;
    return handler;
  }

  public handle(request: $DuplicateFinder.$Request) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return request;
  }
}
