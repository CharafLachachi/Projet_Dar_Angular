import { Component, ViewChild, ElementRef, OnInit, AfterViewInit ,ViewEncapsulation } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import {SelectItem} from 'primeng/api';
import { User } from 'app/_models';

export class Message {
  constructor(
      public sender: string,
      public content: string,
      public isBroadcast = false,
      public type?:string,
      public receiver?:string,
      public connectedUserId?:string,
      public connectedUserName?:string,
      public deconnectedUserId?:string
  ) { }
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit {

  @ViewChild('viewer') private viewer: ElementRef;

  public serverMessages = new Array<Message>();

  public clientMessage = '';
  public isBroadcast = false;
  public sender = '';

  types: SelectItem[];
  selectedType: string;
  private socket$: WebSocketSubject<Message>;
  private currentUser: User = JSON.parse(localStorage.getItem("currentUser"));
  constructor() {
    this.types = [];
    // this.types = [
    //     {label: 'Lachachi Charaf', value: 'Lachachi Charaf'},
    //     {label: 'Lachachi Salim', value: 'Lachachi Salim'},
    // ];
      this.socket$ = new WebSocketSubject('ws://localhost:8080/DAR_PROJECT/ServerEndpointChat/'+[this.currentUser.id]);

      this.socket$
          .subscribe(
          (message) => {
             switch(message.type){
                 case "CONNEXION" : {
                    console.log("connect "+ message.connectedUserName );
                    this.types.push({label : message.connectedUserName ,value : message.connectedUserId})
                 }
                 case "MESSAGE" : {
                    this.serverMessages.push(message) && this.scroll();
                 }
                 case "DECONNEXION" :{
                   if(message.deconnectedUserId){
                    console.log("disconnect "+ message.deconnectedUserId );
                    this.types = this.types.filter(obj => obj.value == message.deconnectedUserId)
                   }
                 }
             }
        },
          (err) => console.error(err),
          () => console.warn('Completed!')
          );
          this.sender = this.currentUser.firstname + " " +this.currentUser.lastname + " " +(this.currentUser.id).toString();
  }

  ngAfterViewInit(): void {
      this.scroll();
  }

  public toggleIsBroadcast(): void {
      this.isBroadcast = !this.isBroadcast;
  }

  public send(): void {
      const message = new Message(
          this.sender, 
          this.clientMessage, 
          this.isBroadcast, 
          "MESSAGE",
          this.selectedType,
          "",
          "");

      this.serverMessages.push(message);
      this.socket$.next(message);
      this.clientMessage = '';
      this.scroll();
  }

  public isMine(message: Message): boolean {
      return message && message.sender === this.sender;
  }

  public getSenderInitials(sender: string): string {
      return sender && sender.substring(0, 2).toLocaleUpperCase();
  }

  public getSenderColor(sender: string): string {
      const alpha = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ';
      const initials = this.getSenderInitials(sender);
      const value = Math.ceil((alpha.indexOf(initials[0]) + alpha.indexOf(initials[1])) * 255 * 255 * 255 / 70);
      return '#' + value.toString(16).padEnd(6, '0');
  }

  private scroll(): void {
      setTimeout(() => {
          this.scrollToBottom();
      }, 100);
  }

  private getDiff(): number {
      if (!this.viewer) {
          return -1;
      }

      const nativeElement = this.viewer.nativeElement;
      return nativeElement.scrollHeight - (nativeElement.scrollTop + nativeElement.clientHeight);
  }

  private scrollToBottom(t = 1, b = 0): void {
      if (b < 1) {
          b = this.getDiff();
      }
      if (b > 0 && t <= 120) {
          setTimeout(() => {
              const diff = this.easeInOutSin(t / 120) * this.getDiff();
              this.viewer.nativeElement.scrollTop += diff;
              this.scrollToBottom(++t, b);
          }, 1 / 60);
      }
  }

  private easeInOutSin(t): number {
      return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
  }

  
}
