import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpParams  } from '@angular/common/http';
import { ISearchModel } from "../_models/ISearchModel";
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { IComment } from 'app/_models/IComment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private getComment_url : string = "http://localhost:8080/DAR_PROJECT/CommentServlet";
  private putComment_url : string = "http://localhost:8080/DAR_PROJECT/CommentServlet";

  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) { 
    this.handleError = httpErrorHandler.createHandleError('CommentService');
  }
  sendComment (comment: IComment) {
    return this.http.post(this.putComment_url, comment,httpOptions)
      .pipe(
        catchError(this.handleError('sendComment', []))
      );
  }

  fetchComment(pub_id : any ) : Observable<IComment[]>{
    const params = new HttpParams().set('pub_id', pub_id);
    return this.http.get<IComment[]>(this.getComment_url,{params})
     .pipe(
      catchError(this.handleError('fetchComment', []))
    );
  }

}
