import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { ISearchModel } from "../_models/ISearchModel";
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};
@Injectable()
export class SearchService   {
  private   searchUrl :  string =  " api/search";
  private   sharePubUrl :  string =  " api/sharePublication";
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) { 
    this.handleError = httpErrorHandler.createHandleError('SearchService');
  }

  postSearch (searchParam: any): Observable<ISearchModel[]> {
    return this.http.post<ISearchModel[]>(this.searchUrl, searchParam,httpOptions)
      .pipe(
        catchError(this.handleError('postSearch', []))
      );
  }

  sharePublication(pub : ISearchModel) {
    pub.idUser  = JSON.parse(localStorage.getItem('userId') || 'false');
    return this.http.post(this.sharePubUrl,pub,httpOptions)
     .pipe(
      catchError(this.handleError('sharePublication', []))
    );
  }
 
}
