import { IAddress } from "./IAddress";
import { IContact } from "./IContact";

export interface ISearchModel {
                 roomPrice?: number;
                 nbPers?: number;
                 radius?: number;
                 picture?: string;
                 checkOutDate?: string;
                 chekInDate?: string;
                 weather?: any;
                 city?: string;
                 hotelName? : string;
                 address?: IAddress;
                 hotelContacts?: IContact;
                 idUser? : any;
                 currency? : string;
                 pub_id? :string;
                 }
  