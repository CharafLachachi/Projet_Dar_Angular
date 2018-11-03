import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class InitialsService {

  constructor(private http: HttpClient) { }

  getAvatarInitials(fn: any,ln: any) {
    return this.http.get<any>(`https://ui-avatars.com/api/`, {
        params: new HttpParams().set('rounded', 'true')
        .set("name",fn+"+"+ln)
    })
        .pipe(map(resp => {
            return resp;
        }));
}
}
