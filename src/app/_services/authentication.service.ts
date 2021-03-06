﻿import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient) { }
    user: User;
    login(email: string, password: string) {
        return this.http.post<any>(`http://localhost:8080/DAR_PROJECT/SignIn`, { email, password })
            .pipe(map(token => {

                // login successful if there's a jwt token in the response
                const helper = new JwtHelperService();
                const decodedToken = helper.decodeToken(token.token);
                console.log("token" + decodedToken);
                this.user = decodedToken;
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(this.user));



                return this.user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    register(user : any){
        const userJson = JSON.stringify(user);
        console.log(userJson)
        return this.http.post<any>(`http://localhost:8080/DAR_PROJECT/SignUp`, user)
            .pipe(map(resp => {
                return resp;
            }));
    }

    // register(user: any) {
    //     const userJson = JSON.stringify(user);
    //     console.log(userJson)
    //     return this.http.get<any>(`https://rocky-ridge-86838.herokuapp.com/GetWeatherByCityName`, {
    //         params: new HttpParams().set('city_name', 'brest')
    //     })
    //         .pipe(map(resp => {
    //             return resp;
    //         }));
    // }
}