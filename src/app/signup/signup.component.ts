import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services';
import {Http, Response} from '@angular/http';
import { map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import { User } from "../_models/user";
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    test : Date = new Date();
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    items = [];
    user: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private http: Http
    ) { }

      // Auto complete for google place 
  public requestAutocompleteItems = (text: string): Observable<Response> => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&language=fr_FR&key=AIzaSyBSnGKpO7hUSjsXgxF6ikkweAuNPNcAj-8`;
    return this.http
        .get(url)
        .pipe(map(data => data.json().predictions.map(
          item => 
          item.description)
          ));
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
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            rePass: ['', Validators.required],
            items: ['']

        });

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

     // convenience getter for easy access to form fields
     get f() { return this.loginForm.controls; }

     onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.user.firstname = this.f.firstname.value;
        this.user.lastname = this.f.lastname.value;
        this.user.email = this.f.email.value;
        this.user.password = this.f.password.value;
        this.user.username = this.f.email.value;

        this.authenticationService.register(this.user)
        .pipe(first())
        .subscribe(
            data => {
                console.log(data)
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.error = error;
                this.loading = false;
            });
        this.loading = true;
    }

}
