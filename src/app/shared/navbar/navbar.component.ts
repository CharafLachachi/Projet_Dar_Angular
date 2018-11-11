import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthenticationService } from '../../_services';
import { InitialsService } from 'app/_services/initials.service';
import { User } from 'app/_models';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    private imageToShow :any;
    private user: User;
    constructor(public location: Location, private element : ElementRef,
        private authenticationService: AuthenticationService,
        private initialService: InitialsService) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
     //   this.register();
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '/home' ) {
            return true;
        }
        else {
            return false;
        }
    }
    // isDocumentation() {
    //     var titlee = this.location.prepareExternalUrl(this.location.path());
    //     if( titlee === '/documentation' ) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    isLogged(){
         this.user = JSON.parse(localStorage.getItem("currentUser"));
        if(this.user){
            return true;
        }
        return false;
    }
    isLogOut() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '/login' ) {
            this.authenticationService.logout();
            return true;
        }
        else {
            return false;
        }
    }

    //  register() {
    //     this.user = JSON.parse(localStorage.getItem("currentUser"));
    //     this.initialService.getAvatarInitials(this.user.firstname,this.user.lastname).
    //     subscribe(
    //       res => {
    //           console.log(res)
    //         this.imageToShow = res;
    //       });
    // }
}
