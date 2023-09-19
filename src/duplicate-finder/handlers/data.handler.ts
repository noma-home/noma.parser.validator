import { AbstractHandler } from "./abstract.handler";
import { $DuplicateFinder } from "./interfaces";

/**
 * Step #1 Handler
 * Finds all possible duplicates using advert data (area, number of room, etc)
 */
export class DataHandler extends AbstractHandler {
  // TODO: add $Advert
  private generateQuery(advert: any) {
    return {
      area: {
        totalArea: 12,
      },
    };
  }

  public async handle(request: $DuplicateFinder.$Request): Promise<$DuplicateFinder.$Request> {
    request.possibleDuplicates = await this.advertService.filter(this.generateQuery({}));
    return super.handle(request);
  }
}
