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
import { CommentComponent } from "../comment/comment.component";
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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

  @ViewChild('searchin') public searchElement: ElementRef;
  public date: any = {};
  items = [];
  user: any = {};
  radius: string;
  price: number;
  nbpers: number;
  offers: ISearchModel[];
  d: Date;
  message: any;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  isSpinner: boolean;


  searchForm : FormGroup;

  // used for date picker
  date6: Date;
  rangeDates: Date[];
  minDate: Date;
  maxDate: Date;

  private userId = JSON.parse(localStorage.getItem("currentUser")).id;
  public requestAutocompleteItems = (text: string): Observable<Response> => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&language=fr_FR&key=AIzaSyBSnGKpO7hUSjsXgxF6ikkweAuNPNcAj-8`;
    return this.httpClient.jsonp(url, 'callback')
      .pipe(map(data => data['predictions'].map(
        item =>
          item.description)
      ));
  };

  constructor(private httpClient: HttpClient, private searchService: SearchService,
    protected dateService: NbDateService<Date>, private data: DataService, private formBuilder: FormBuilder,
    private router: Router, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
   
    this.mapsAPILoader.load().then(
      () => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types: [] });
        autocomplete.setComponentRestrictions({ 'country': ['fr'] });
        autocomplete.setTypes(["administrative_area_level_1"]);
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            this.items.push(autocomplete.getPlace().formatted_address);
            this.user.cities = this.items;
            console.log(autocomplete.getPlace().formatted_address);
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
          });
        });
      }
    );
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
    this.submitted = true;

    // stop here if form is invalid
    if (this.searchForm.invalid) {
        return;
    }

    this.loading = true;
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
  get f() { return this.searchForm.controls; }
  public onAddItem(item) {
    //  this.items.push(item.display)
    //  console.log(this.date.start);
    //this.user.cities = this.items;
    console.log(this.user.cities.length);

  }
  public onRemoveItem(item) {
    this.items.splice(this.items.indexOf(item, 0));
    this.user.cities = this.items;
  }



  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      price: ['', Validators.required],
      nbrPr: ['', Validators.required],
      radiusF: ['', Validators.required],
      city: ['', Validators.required],
      date_range: ['', Validators.required],
    });

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


}
