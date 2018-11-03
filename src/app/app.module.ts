import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import {  HttpRequest } from '@angular/common/http';
import { NbCardModule } from "@nebular/theme";

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ThemeModule } from './@theme/theme.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken } from '@nebular/auth';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { LoginComponent } from './login';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule  } from "@angular/platform-browser/animations";
import { HomeModule } from './home/home.module';
import { HttpModule } from '@angular/http';
import { SearchComponent } from '../app/search/search.component';
import { NbDatepickerModule } from "@nebular/theme/components/datepicker/datepicker.module";
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';

export function nbNoOpInterceptorFilter(req: HttpRequest<any>): boolean {
  return true;
}
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    SearchComponent
  ],
  imports: [
    BrowserAnimationsModule,
    TagInputModule,
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule,
    AppRoutingModule,
    HomeModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NbDatepickerModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            class: NbAuthJWTToken,
            key: 'token',
          },
          baseEndpoint: '/api/',
           login: {
             endpoint: '/SignIn',
           },
           register: {
             endpoint: '/SignUp',
             method: 'post',
           },
        }),
      ],
      forms: {},
    }), 
    ThemeModule.forRoot(),
    CalendarModule,
    CardModule,
    NbCardModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        // provider used to create fake backend
        fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
