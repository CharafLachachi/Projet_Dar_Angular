import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from "../comment/comment.service";
import { Http, Response } from '@angular/http';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IComment } from 'app/_models/IComment';
import { Comment } from 'app/_models/Comment';
import { DomSanitizer } from '@angular/platform-browser';
import { ShowProfileService } from "../show-profile/show-profile.service";
import { User } from 'app/_models';
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

   comments : IComment[];
   newComment : IComment;
   currentUser : User;
    profile_img_url : any ="";
  @Input() pub_id: string;
  @Input() image_url: Blob;

  constructor(private commentService: CommentService, private httpClient: Http, private sanitizer: DomSanitizer,
    ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.newComment = new Comment(
      this.currentUser.id,
      this.currentUser.firstname + " " + this.currentUser.lastname
    )
    this.fetchComment();
    console.log("pub "+this.pub_id)
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
      this.fetchComment();
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
