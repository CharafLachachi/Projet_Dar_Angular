import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {CardModule} from 'primeng/card';
import { NbCardModule } from "@nebular/theme";

import { ComponentsModule } from '../components/components.module';
import { PublicationComponent } from "../publication/publication.component";

import { MessageService } from '../message.service';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { DataService } from "../data.service";
@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule,
        ComponentsModule,
        MatExpansionModule,
        MatIconModule,
        CardModule,
        NbCardModule
    ],
    declarations: [ HomeComponent, PublicationComponent],
    exports:[ HomeComponent ],
    providers: [MessageService,DataService,HttpErrorHandler]
})
export class HomeModule { }
