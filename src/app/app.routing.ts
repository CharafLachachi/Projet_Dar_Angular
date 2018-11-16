import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';
import { NbAuthComponent } from '@nebular/auth';
import { SearchComponent } from './search/search.component';
import { ShowProfileComponent } from './show-profile/show-profile.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes =[
    
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup',         component: SignupComponent },
  { path: 'search',     component: SearchComponent , canActivate: [AuthGuard]},
     { 
     path: 'home', 
     canActivate: [AuthGuard], component: HomeComponent },
     { path: 'user-profile',   component: ProfileComponent , canActivate: [AuthGuard]},
     { path: 'profile',   component: ShowProfileComponent ,  canActivate: [AuthGuard] },
     { path: 'chat',   component: ChatComponent ,  canActivate: [AuthGuard]},

    // { path: 'signup',         component: SignupComponent },
    // { path: 'landing',       component: LandingComponent },
    // { path: 'nucleoicons',     component: NucleoiconsComponent },
    // { path: '', redirectTo: 'home', pathMatch: 'full' }
];
export const routing = RouterModule.forRoot(routes);

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
