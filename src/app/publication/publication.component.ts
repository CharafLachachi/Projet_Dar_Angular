import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { PublicationService } from "./publication.service";
import {Http, Response} from '@angular/http';
import { IPub } from "../_models/IPub";
import { HttpHandler } from '@angular/common/http';
import { HttpErrorHandler } from "../http-error-handler.service";
import { ISearchModel } from "../_models/ISearchModel";
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { InitialsService } from 'app/_services/initials.service';
@Component({
  selector: 'ngx-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss'],
  providers : [PublicationService,HttpErrorHandler],
})
export class PublicationComponent implements OnInit {

  UserName: string;
  UserId : number;
  user : User;
  resultsPubs : IPub[];
  faCoffee = faCoffee;
  loadCommentAllowed : boolean;



  map : Map<any,any>;

  constructor(private publicationService : PublicationService,private httpClient: Http, private initialService : InitialsService) { }
  ngOnInit() {
     this.map = new Map();
    // const decodedJson = JSON.parse(localStorage.getItem("auth_app_token"));
    // const tokenValue = decodedJson.value;

    // const helper = new JwtHelperService();
    // const decodedToken = helper.decodeToken(tokenValue);

    // this.user = decodedToken;
    // this.UserName = this.user.username;
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    this.UserId = this.user.id;
    //this.displayPublications();
    
    this.display();
   
    

    this.loadCommentAllowed = false;
  }

  secondes: number;

  displayPublications(){
      //observable tuto
    const counter = Observable.interval(1000); 
    counter.subscribe(
    (value) => {
      this.secondes = value;
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ' + error);
      },
      () => {
        console.log('Observable complete!');
      }
    );
  } 
  //recuperer les publications avec Http
  display(){
    console.log('scope is ');
    this.publicationService.postPub({userid : this.UserId}).subscribe(res => {
      this.resultsPubs = res; 
      console.log("yaaaaay"+this.resultsPubs[1].owner);
     // console.log("equal"+this.resultsPubs[0].owner+" "+this.UserId);
     
      for (let i in this.resultsPubs) {
        
        if( this.resultsPubs[i].abonnes.length >= this.resultsPubs[i].nbPers 
          || this.resultsPubs[i].owner === this.UserId){
            //désactivé
          this.map.set(this.resultsPubs[i].pub_id, false);
        }else{
          //activé
          this.map.set(this.resultsPubs[i].pub_id, true);
        }
      }
        console.log("yaaaaay"+this.map.get(2)); 
    },
    error =>{
    console.log("Error", error);
    });
  }

  public loadComment(){
    this.loadCommentAllowed = !this.loadCommentAllowed;
  }

  onSubmit(offer: IPub) {
    let json = {"userid" : this.UserId , "pubid" : offer.pub_id} ;
    this.publicationService.joinPublication(json).
    subscribe(
      res => {
        console.log("Success", "success");
        offer.abonnes = res;
      },
      error => {
        console.log("Error", error);
      }
    );
    console.log(this.resultsPubs[0].abonnes.length);
  }

  isValid(pub_id : number){
    return this.map.get(pub_id);
  }
}
