import { AbstractHandler } from "./abstract.handler";
import { $DuplicateFinder } from "./interfaces";

export class ImageHandler extends AbstractHandler {
    public handle(request: $DuplicateFinder.$Request): $DuplicateFinder.$Request | Promise<$DuplicateFinder.$Request> {
        request.possibleDuplicates.push("Something");
        return super.handle(request);
    }
}
