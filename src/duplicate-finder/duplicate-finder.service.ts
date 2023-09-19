import { Injectable } from "@nestjs/common";
import { Handler } from "./handlers";

@Injectable()
export class DuplicateFinderService {
  constructor(private readonly handler: Handler) {}
}
