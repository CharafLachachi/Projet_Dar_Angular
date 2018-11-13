import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams  } from '@angular/common/http';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { tap, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { IPub } from '../_models/IPub';
import { ResponseContentType } from '@angular/http';
import { User } from "../_models/user";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShowProfileService {
    
  private   ProfileUrl :  string =  "http://localhost:8080/DAR_PROJECT/ShowProfile";
  private DeletePublicationUrl : string ="http://localhost:8080/DAR_PROJECT/DeletePublication"
  private UploadProfilePictureUrl : string ="http://localhost:8080/DAR_PROJECT/UploadProfilePicture"
  private GetProfilePictureUrl : string ="http://localhost:8080/DAR_PROJECT/GetProfilePicture"
  private UnsubscribeToPublicationUrl : string = "http://localhost:8080/DAR_PROJECT/UnsubscribeToPublication"
  private handleError: HandleError;
  
    
  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) { 
  
    this.handleError = httpErrorHandler.createHandleError('ProfileService');

  }

   //récuperer les pubs
    getPublications(){
    // const params = new HttpParams().set('id', '13');
    // Observable<Pub[]> publications$ = this.http.get<IPub>('api.learn-angular.fr/article', {params});
    }
 
    //contact serveur
    // retrives personnal publications and publications of interest  
    
  GetAllPublications(idUser : any): Observable<IPub[][]> {
      return this.http.post<IPub[][]>(this.ProfileUrl,idUser,httpOptions)
        .pipe(
          catchError(this.handleError('GetPublications', []))
        );
  }

	delete_own_publication(id_pub: any): Observable<string[]>{
	
	return this.http.post<string[]>(this.DeletePublicationUrl,id_pub,httpOptions)
        .pipe(
          catchError(this.handleError('DeletePublication', []))
        );
	
	
  }
  
  unsubscribe_to_publication(data : any ): Observable<string[]>{
	
    return this.http.post<string[]>(this.UnsubscribeToPublicationUrl,data,httpOptions)
          .pipe(
            catchError(this.handleError('UnsubscribeToPublication', []))
          );
    
    
  }

    /*
    GetPublicationsOfInterest(idUser : any): Observable<IPub[]> {
        return this.http.post<IPub[]>(this.ProfileUrl,idUser,httpOptions)
          .pipe(
            catchError(this.handleError('GetPublicationsOfInterest', []))
          );
      }
    */

  /*  upload_image(user_id: number, img : File) {

      const params = new HttpParams().set('user_id', ""+user_id);
     
     // return this.http.post(this.UploadProfilePictureUrl,fd,{params})
     console.log("image size : "+img.size);

     return this.http.post(this.UploadProfilePictureUrl,img,{responseType: 'arraybuffer',params}  );
    }

*/


  upload_image(user_id: number, img : File) : Observable<Blob>{

        const params = new HttpParams().set('user_id', ""+user_id);
      
      // return this.http.post(this.UploadProfilePictureUrl,fd,{params})
      console.log("image size : "+img.size);

      return this.http.post(this.UploadProfilePictureUrl,img,{responseType: "blob",params}  );
  }

  get_profile_image(user_id: number) : Observable<Blob>{

        const params = new HttpParams().set('user_id', ""+user_id);
        // return this.http.post(this.UploadProfilePictureUrl,fd,{params})
        return this.http.post(this.GetProfilePictureUrl,null,{responseType: "blob",params}  );
      
  }

  editProfile(user : User){
    
    // le code ici juste pour eviter une erreur mets ton propore code
    // il faut aussi ramener le password du serveur
    const params = new HttpParams().set('user_id', ""+user.id);
    return this.http.post(this.GetProfilePictureUrl,null,{responseType: "blob",params}  );
  }
  



}



