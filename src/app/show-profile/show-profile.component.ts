import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/user';
import { Router,ActivatedRoute } from '@angular/router';
import { IPub } from '../_models/IPub';
import { ShowProfileService } from './show-profile.service';
import { HttpErrorHandler } from '../http-error-handler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Http, Response, Headers} from '@angular/http';

@Component({
  selector: 'ngx-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.scss'],
  providers: [ShowProfileService, HttpErrorHandler]
})
export class ShowProfileComponent implements OnInit {

  @ViewChild("ProfileImage") image: ElementRef;
  private bodyText: string;

  user: User;
  avatar_url: any = "https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/44065456_10217613472156518_4659508872950579200_n.jpg?_nc_cat=106&_nc_ht=scontent-cdt1-1.xx&oh=2a2f5217deabe974e36aed62eee5c623&oe=5C560D45";
  default_url: any = "https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg";
  
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';


  private OwnPublications: IPub[];
  private PublicationsOfInterest: IPub[];
  private ProfilePicture: File;
  private selectedFile: File;
  private image_url: any;
  items = [];

  constructor(private router: Router, private show_profile_service: ShowProfileService,
    private sanitizer: DomSanitizer, private formBuilder: FormBuilder, private route: ActivatedRoute, private http: Http

    ) { }

    display: boolean = false;

   
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    console.log("show profile");
    this.get_profile_picture();
    console.log("show profile : about to get publications");
    this.get_publications();
  
    let a: String[] = ["empty"];
    //console.log("here 1"+ (this.user.cities == a));
    if( ! ( this.user.cities  == a ) )
    for(let s of this.user.cities.toString().split("/") ){
      this.items.push(s);   
    }
    console.log("cities :"+this.user.cities.length); 
   
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      rePass: ['', Validators.required],
      items: ['', Validators.nullValidator],
  });

  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  get_publications() {


    this.show_profile_service.GetAllPublications({ userid: this.user.id }).subscribe(res => {
      this.OwnPublications = res[0];
      this.PublicationsOfInterest = res[1];
      console.log("show profile got pubs");
      console.log("pub 0", res[0]);
      console.log("pub 1", res[1]);
      //  console.log("pub 2",res[2]);
    },
      error => {
        console.log("Show profile Error", error);
      });


  }

  edit() {

    console.log("je modifie");

  }

  edit_profile() {

    this.router.navigate(['/pages/profile']);

  }

  delete_publication(pub: IPub) {

    // console.log("publication id: ",pub.pub_id); => works fine. 
    this.show_profile_service.delete_own_publication({ publicationId: pub.pub_id }).subscribe(result => {

      const index: number = this.OwnPublications.indexOf(pub);
      let a: String[] = ["1"];

      /* console.log("equality1:", result[0] == "0");
       console.log("equality2:", result[0] === "0");
       console.log("equality3:", result[0] == '0');
       console.log("equality4:", result[0] === '0');
       console.log("equality5:", result === b);
       console.log("equality6:", result == b );
        console.log("equality7:", result === a);
       console.log("equality8:", result == a );
       */

      if (index !== -1 && result == a) {
        console.log("bingo time to splice");
        this.OwnPublications.splice(index, 1);
      }
      console.log("delete pub returned" + result);
    },
      error => {
        console.log("delete pub Error", error);
      });



    /* for(let pub of this.OwnPublications){
    
    }*/

  }


  unsubscribe_to_publication(pub: IPub) {

    // console.log("publication id: ",pub.pub_id); => works fine. 
    this.show_profile_service.unsubscribe_to_publication({ publicationId: pub.pub_id, UserId: this.user.id }).subscribe(result => {

      const index: number = this.PublicationsOfInterest.indexOf(pub);
      let a: String[] = ["1"];

      if (index !== -1 && result == a) {
        console.log("bingo time to splice");
        this.PublicationsOfInterest.splice(index, 1);
      }
      console.log("unsubscribe to pub returned" + result);
    },
      error => {
        console.log("unsubscribe to pub Error", error);
      });

  }

  onFileChanged(event) {

    this.selectedFile = event.target.files[0]

  }

  /* onUpload() {
   
       this.ProfilePicture = this.selectedFile;
     //  const uploadData = new FormData();
     //  uploadData.append("myPicture", this.selectedFile, this.selectedFile.name);
     //  this.avatar_url = URL.createObjectURL(this.ProfilePicture);
     this.show_profile_service.upload_image(this.user.id,this.selectedFile).subscribe(
       (res : any) => {
         let blob = new Blob([res._body]);
         let urlCreator = window.URL;
         this.avatar_url = this.sanitizer.bypassSecurityTrustUrl( urlCreator.createObjectURL(blob));
     console.log("url",this.avatar_url);
     },
         error =>{
         console.log("UploadProfilePicture  Error", error);
         }
       );
   }
 */
  private _window: Window;

  onUpload() {

    this.ProfilePicture = this.selectedFile;
    this.show_profile_service.upload_image(this.user.id, this.selectedFile).subscribe(
      (res: Blob) => {

        let urlCreator = window.URL;
        this.default_url= urlCreator.createObjectURL(res);
        //  this.avatar_url = this.sanitizer.bypassSecurityTrustUrl( urlCreator.createObjectURL(blob));
        //  console.log("url",this.avatar_url);
      },
      error => {
        console.log("UploadProfilePicture  Error", error);
      }
    );
  }

  get_profile_picture() {

    this.show_profile_service.get_profile_image(this.user.id).subscribe(
      (res: Blob) => {
        console.log("Blob size", res.size);
        if (res.size == 0) {
          //this.image.nativeElement.src = this.default_url;
          return;
        }
        let urlCreator = window.URL;
        this.default_url =urlCreator.createObjectURL(res);
        //  this.avatar_url = this.sanitizer.bypassSecurityTrustUrl( urlCreator.createObjectURL(blob));
        //  console.log("url",this.avatar_url);
      },
      error => {
        let urlCreator = window.URL;
        // this.image.nativeElement.src = urlCreator.createObjectURL(this.default_url)
        console.log("UploadProfilePicture  Error", error);
      }
    );






  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}
  // Moadal 
  showDialog() {
    this.display = true;
}

// form edit profile 

get f() { return this.loginForm.controls; }

onSubmit() {
   this.submitted = true;
   console.log("about to submit");
   // stop here if form is invalid
   if (this.loginForm.invalid) {
       return;
   }
   console.log("valid form"); 
   var user : User = new User(); 
   this.loading = true;
   user.id = this.user.id; 
   user.firstname = this.f.firstname.value;
   user.lastname = this.f.lastname.value;
   user.email = this.f.email.value;
   user.password = this.f.password.value;
   user.username = this.f.email.value;
   
   var s : String = "empty" ;
   var i : number = 0  ;  
   
   for(let ss of this.items){
    if(i==0) s = ""; 
    s+= ss ; 
    if(i < this.items.length -1 )
      s+="/"; 
      i++; 
   }
   
   user.cities = [s]; 

   this.show_profile_service.editProfile(user)
   .pipe(first())
   .subscribe(
       data => {
          
                const helper = new JwtHelperService();
                const decodedToken = helper.decodeToken(data.token);
                console.log("token" + decodedToken);
                this.user = decodedToken;
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(this.user));

       },
       error => {
           this.error = error;
           this.loading = false;
       });
   this.loading = true;
}

 // Auto complete for google place 
       public requestAutocompleteItems = (text: string): Observable<Response> => {

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&language=fr_FR&key=AIzaSyBSnGKpO7hUSjsXgxF6ikkweAuNPNcAj-8`;
    return this.http
        .get(url)
        .pipe(map(data => data.json().predictions.map(
          item => item.description 
          )));
  };

  public onAddItem(item){
    
    this.items.push(item.display)
   // console.log(this.items.length);
    this.user.cities = this.items;
    console.log(this.user.cities);

    
  }
  public onRemoveItem(item){
    this.items.splice(this.items.indexOf(item,0));
   // console.log(this.items.length);
    this.user.cities = this.items;
    console.log(this.user.cities);

  }


}