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
import { AvatarModule } from "ngx-avatar";
import { ComponentsModule } from '../components/components.module';
import { PublicationComponent } from "../publication/publication.component";
import {CommentComponent } from "../comment/comment.component";
import { MessageService } from '../message.service';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { DataService } from "../data.service";
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { from } from 'rxjs';
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
        NbCardModule,
        AvatarModule,
        ProgressSpinnerModule
    ],
    declarations: [ HomeComponent, PublicationComponent, CommentComponent],
    exports:[ HomeComponent ],
    providers: [MessageService,DataService,HttpErrorHandler]
})
export class HomeModule { }
