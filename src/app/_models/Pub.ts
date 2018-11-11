import { IAddress } from "./IAddress";

export class Pub {

    constructor(
                public pub_id?: number,
                public roomPrice?: number,
                public nbPers?: number,
                public radius?: number,
                public picture?: string,
                public checkOutDate?: string,
                public chekInDate?: string,
                public weather?: string,
                public city?: string,
                public hotelName? : string,
                public address?: IAddress,
                public hotelContacts?: string[]) {
    }
  }