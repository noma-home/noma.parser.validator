export namespace $DuplicateFinder {
  export interface $Request {
    advert: Object; // TODO: add $RawAdvert interface
    possibleDuplicates: any[]; // TODO: add $RawAdvert interface
  }

  export interface $Handler {
    setNext(handler: $Handler): void;
    handle(request: $Request): $Request | Promise<$Request>;
  }
}
