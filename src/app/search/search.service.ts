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
  private   searchUrl :  string =  "https://rocky-ridge-86838.herokuapp.com/search";
  private   sharePubUrl :  string =  "https://rocky-ridge-86838.herokuapp.com/sharePublication";
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
    return this.http.post(this.sharePubUrl,pub,httpOptions)
     .pipe(
      catchError(this.handleError('sharePublication', []))
    );
  }
 
}
