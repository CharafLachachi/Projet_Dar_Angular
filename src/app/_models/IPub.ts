import { IAddress } from "./IAddress";
export interface IPub {
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