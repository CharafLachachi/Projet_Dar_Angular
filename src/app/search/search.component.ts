import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SearchService } from "./search.service";
import { HttpErrorHandler } from "../http-error-handler.service";
import { ISearchModel } from "../_models/ISearchModel";
import { NbDateService } from '@nebular/theme';
import { DataService } from "../data.service";
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {CommentComponent  } from "../comment/comment.component";


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};
@Component({
  selector: 'ngx-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchService, HttpErrorHandler]
})
export class SearchComponent implements OnInit {

  public date: any = {};
  items = [];
  user: any = {};
  radius: string;
  price: number;
  nbpers: number;
  offers: ISearchModel[];
  searchUrl: "api/search";
  d: Date;
  message: any;
  submitted = false;


  isSpinner : boolean ;


  profileForm = new FormGroup({
    roomPrice: new FormControl(''),
    nbPers: new FormControl(''),
    radius: new FormControl(''),
    checkOutDate: new FormControl(''),
    chekInDate: new FormControl(''),
    temp: new FormControl(''),
    city: new FormControl(''),
    email: new FormControl(''),
    adresse: new FormControl(''),
    url: new FormControl(''),
    tel: new FormControl(''),
    hotelName: new FormControl(''),
  });

  // used for date picker
  date6: Date;
  rangeDates: Date[];
  minDate: Date;
  maxDate: Date;

  private userId = JSON.parse(localStorage.getItem("currentUser")).id;
  public requestAutocompleteItems = (text: string): Observable<Response> => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&language=fr_FR&key=AIzaSyBSnGKpO7hUSjsXgxF6ikkweAuNPNcAj-8`;
    return this.httpClient
      .get(url)
      .pipe(map(data => data.json().predictions.map(
        item =>
          item.description)
      ));
  };

  constructor(private httpClient: Http, private searchService: SearchService,
    protected dateService: NbDateService<Date>, private data: DataService,
    private router: Router) {
  }
  onSubmit(offer: ISearchModel) {
    offer.idUser = this.userId;
    this.searchService.sharePublication(offer).
      subscribe(
        res => {
          this.router.navigate(['/home'])
        },
        error => {
          console.log("Error", error);
        }
      );

    // console.warn(offer.roomPrice);
  }
  public search() {
    this.isSpinner = true;
    this.searchService.postSearch({
      "price": this.price,
      "nbPers": this.nbpers,
      "radius": this.radius,
      "cities": this.user.cities,
      "chekInDate": this.rangeDates[0],
      "checkOutDate": this.rangeDates[1],
    }).subscribe(res => {
      this.offers = res; console.log(this.offers[0]);
      this.isSpinner = false;
    },
      error => {
        console.log("Error", error);
        this.isSpinner = false;
      });


  }

  public onAddItem(item) {
    this.items.push(item.display)
    //  console.log(this.date.start);
    this.user.cities = this.items;
    console.log(this.user.cities.length);

  }
  public onRemoveItem(item) {
    this.items.splice(this.items.indexOf(item, 0));
    this.user.cities = this.items;
  }



  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let day = today.getDay();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(year);
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(year);
    this.isSpinner = false;
  }
  sendWeather(message: any) {
    this.message = message;
    this.data.changeMessage(message);
  }
  public handleDateChange(event?: any) {
    console.log(this.userId);
    console.log(this.date.start);
    this.d = new Date(this.date.start);
  }

  public getRandomPicture(){
   
    this.searchService.getRandomPicture().subscribe(
      res => {  
        console.log(res['results'][0]['urls']['small']);
        return res['results'][0]['urls']['small'];
      }
    )
  }
}
