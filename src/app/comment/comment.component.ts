import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from "../comment/comment.service";
import { Http, Response } from '@angular/http';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IComment } from 'app/_models/IComment';
import { Comment } from 'app/_models/Comment';

import { User } from 'app/_models';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  private comments : IComment[];
  private newComment : IComment;
  private currentUser : User;
 
  @Input() pub_id: string;

  constructor(private commentService: CommentService, private httpClient: Http ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.newComment = new Comment(
      this.currentUser.id,
      this.currentUser.firstname + " " + this.currentUser.lastname
    )
    this.fetchComment();
    // this.newComment.comment_user_id = this.currentUser.id;
    // this.newComment.comment_user_name = this.currentUser.firstname + " " + this.currentUser.lastname;
    // this.newComment.comment_text = "";
  }

  public sendComment(){
    this.newComment.comment_id_pub = this.pub_id;
    this.commentService.sendComment(this.newComment)
    .subscribe(res => {
      console.log("server response "+ res);
      this.newComment.comment_text = "";
      this.newComment.comment_id_pub  = null ;
    },
      error => {
        console.log("Error", error);
      });
  }

  public fetchComment(){
    this.commentService.fetchComment(this.pub_id).
    subscribe(res => {
      this.comments = res; console.log(res.length);
    },
      error => {
        console.log("Error", error);
      });
  }

}
