// export class User {
//     id: number;
//     email : string;
//     username: string;
//     password: string;
//     firstName: string;
//     lastName: string;
// }

export class User {

    constructor(public id?: number,
                public email?: string,
                public password?: string,
                public rememberMe?: boolean,
                public terms?: boolean,
                public confirmPassword?: string,
                public firstname?: string,
                public username?: string,
                public lastname?: string,
                public cities?: any[]) {
    }
  }
  