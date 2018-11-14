import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { IPub } from '../_models/IPub';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { tap, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private   dashboardUrl :  string =  "http://localhost:8080/DAR_PROJECT/dashboard";
  private joinUrl : string = "http://localhost:8080/DAR_PROJECT/join";
  private handleError: HandleError;
  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) { 
    this.handleError = httpErrorHandler.createHandleError('PublicationService');
  }

 

  //récuperer les pubs
  getPublications(){
   // const params = new HttpParams().set('id', '13');
   // Observable<Pub[]> publications$ = this.http.get<IPub>('api.learn-angular.fr/article', {params});
  }
  //contacter le serveur
  postPub(idUser : any): Observable<IPub[]> {
      return this.http.post<IPub[]>(this.dashboardUrl,idUser,httpOptions)
        .pipe(
          catchError(this.handleError('postDashboard', []))
        );
  }

  joinPublication (json : any ): Observable<any[]> {
    return this.http.post<any[]>(this.joinUrl,json,httpOptions)
    .pipe(
      catchError(this.handleError('postJoin', []))
    );
  }
}



