import { IAddress } from "./IAddress";
export interface IPub {
    pub_id?:number;
    roomPrice?: number;
    nbPers?: number;
    radius?: number;
    picture?: string;
    checkOutDate?: string;
    chekInDate?: string;
    weather?: string;
    city?: string;
    hotelName? : string;
    address?: IAddress;
    hotelContacts?: string[];
}