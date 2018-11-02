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

import { faCoffee } from '@fortawesome/free-solid-svg-icons';
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
  constructor(private publicationService : PublicationService,private httpClient: Http) { }
  ngOnInit() {
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
      console.log(this.resultsPubs[0].roomPrice);
    },
    error =>{
    console.log("Error", error);
    });
    
  }
  
}
