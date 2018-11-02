import { IAddress } from "./IAddress";
import { IContact } from "./IContact";
export class searchModel {

    constructor(public id?: number,
                public roomPrice?: number,
                public nbPers?: number,
                public radius?: number,
                public picture?: string,
                public checkOutDate?: string,
                public chekInDate?: string,
                public weather?: any,
                public city?: string,
                public hotelName? : string,
                public address?: IAddress,
                public hotelContacts?: IContact) {
    }
  }
  