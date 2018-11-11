import { IComment } from "./IComment";
export class Comment implements IComment {
    comment_id?: number;
    comment_text?:string;
    comment_user_id?: any;
    comment_created_date?:any;
    comment_user_name? : string;
    comment_id_pub?:string;

    constructor( 
        comment_user_id?: any,
        comment_user_name? : string){
            this.comment_user_id = comment_user_id;
            this.comment_user_name = comment_user_name;
            this.comment_text = "";
        }
    }