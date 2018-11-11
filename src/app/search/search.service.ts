import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpParams  } from '@angular/common/http';
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
  private   searchUrl :  string =  "http://localhost:8080/DAR_PROJECT/search";
  private   sharePubUrl :  string =  "http://localhost:8080/DAR_PROJECT/sharePublication";
  private splashApiUrl : string = "https://api.unsplash.com/search/photos"
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

  getRandomPicture(): Observable<string>{
    let params = new HttpParams().set("count", "1").set("client_id","d0362b01cac6c3d3a77008660ab5c15341cd84d3d3428dd223c1bc29091ed6c9").set("query","wonderlust");
    return this.http.get<string>(this.splashApiUrl,{"params" : params });
  }
 
}
