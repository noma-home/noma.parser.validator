import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { AxiosError, AxiosResponse } from "axios";
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
     * Should be preformed after *getSettlement*
     * @param settlement {string} - settlement
     */
    public async getSubRegion(settlement: string | null) {
        if (settlement) {
            try {
                const response = await lastValueFrom(this.httpService.get(`${this.baseURL}/settlement/${settlement}`));
                return response.data.subRegion;
            } catch (e) {
                return null;
            }
        }

        return null;
    }

    /**
     * For a giving advert location data finds Noma Location Settlement
     * Should be performed after *getRegion*
     * @param location {$Advert.$Location} - advert location data
     */
    public async getSettlement(settlementRaw: string | null, region: string) {
        const settlement = settlementRaw.trim().replace("село", "").replace("місто", "").toLowerCase();

        if (settlement === "львів") {
            return "64c552e4eca4d39d102386ae";
        }

        if (settlement) {
            const regex = LocationService.stringToRegex(settlement);

            try {
                const response = await lastValueFrom(
                    this.httpService.get(`${this.baseURL}/settlement/filter`, {
                        params: { regex, regionID: region },
                    }),
                );

                if (response.data.length > 1) {
                    this.logger.error(`Location cast error: found more than one match for settlement ${settlement}`);
                } else if (response.data.length === 0) {
                    this.logger.error(`Location cast error: no matching settlement for ${settlement}`);
                } else {
                    return response.data[0]._id;
                }
            } catch (e) {
                if (e instanceof AxiosError) {
                    this.logger.error(`${e.response?.data}`);
                }
                return null;
            }
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
     * @param settlement - advert settlement(id)
     * @param district - advert district(id)
     */
    public async getStreet(
        location: $Advert.$Location,
        settlement: string | null,
        district: string | null,
    ): Promise<string | null> {
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
                street
                    .toLowerCase()
                    .replace("вулиця", "")
                    .replace("проспект", "")
                    .replace("вул", "")
                    .replace("просп", ""),
            );

            const params = { type, regex };

            if (settlement) {
                params["settlementID"] = settlement;
            }

            if (district) {
                params["districts"] = { anyOf: [district] };
            }

            try {
                const response: AxiosResponse<{ _id: string }[]> = await lastValueFrom(
                    this.httpService.get(`${this.baseURL}/street`, { params }),
                );

                if (response.data.length > 1) {
                    this.logger.error(`Location cast error: found more than one match for street ${street}`);
                    return null;
                } else if (response.data.length === 0) {
                    this.logger.error(`Location cast error: no matching streets for ${street}`);
                    return null;
                } else {
                    return response.data[0]._id;
                }
            } catch (e) {
                return null;
            }
        }

        return null;
    }
}
