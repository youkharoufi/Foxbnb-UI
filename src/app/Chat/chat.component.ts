import { Message } from './../Models/messages';
import { UserService } from './../Services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApplicationUser } from '../Models/applicationUser';
import { CommonModule } from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ChatService } from '../Services/chat.service';
import { FormsModule, NgForm } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  owner!:ApplicationUser;
  currentUser!:ApplicationUser;
  today = new Date();

  receivedMessages:Message[]=[];
  sentMessages:Message[]=[];

  combinedMessages!:Message[];

  te3= this.chatService.messageReceived

  newMessage='';
  chatForm!:NgForm;

  currentDate=new Date();

  constructor(private route: ActivatedRoute, private userService: UserService,
    private _snackBar: MatSnackBar, private chatService: ChatService){}

  openSnackBar() {
    this._snackBar.open('Sorry ! You have to be logged in !', 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }


  ngOnInit(): void{
    this.route.params.subscribe({
      next:(value:Params)=>{
        this.userService.getUserById(value['ownerId']).subscribe({
          next:(value:ApplicationUser)=>{
            this.owner = value;
            const localUser = JSON.parse(localStorage.getItem('user')!);

    if(localUser !== null && localUser !== undefined){
      this.currentUser = localUser;
      this.chatService.getReceivedMessages(this.currentUser.id!, this.owner.id!).subscribe({
        next:(values:Message[])=>{
          this.receivedMessages = values;
          this.combineAndSortMessages();
        }
      })

      this.chatService.getSentMessages(this.currentUser.id!, this.owner.id!).subscribe({
        next:(values:Message[])=>{
          this.sentMessages = values;
          this.combineAndSortMessages();
        }
      })
      this.chatService.messageReceived.subscribe((message: Message | null) => {
        if (message && message.senderId !== this.currentUser.id) {
          // Add the message to receivedMessages array only if it's not sent by the current user
          this.receivedMessages.push(message);
          this.combineAndSortMessages();
        }
      });
      }
      else{
        this.openSnackBar();
      }
          }
        })
      }
    })
  }

  // In your component class
trackByMessages(index: number, message: Message): string {
  return message.id;
}


combineAndSortMessages(): void {
  // Combine messages and remove potential duplicates
  const combined = [...this.receivedMessages, ...this.sentMessages];
  this.combinedMessages = combined.filter((msg, index, self) =>
    index === self.findIndex((t) => t.id === msg.id)
  );

  // Sort messages by timestamp
  this.combinedMessages.sort((a, b) => new Date(a.dateSent).getTime() - new Date(b.dateSent).getTime());
}


  sendMessage(){
    if (!this.currentUser?.id || !this.owner?.id || !this.newMessage) {
      console.error('Error: Missing data for sending message');
      return;
    }

    var date = new Date();
    var formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York' });
    console.log(formatter.format(date)); // displays date in Eastern Time


    const newMessage: Message = {
      id:uuidv4(),
      senderId:this.currentUser.id!,
      receiverId:this.owner.id!,
      dateSent:date,
      read:false,
      content:this.newMessage
    }
    this.sentMessages.push(newMessage);

  // Clear the input
  this.newMessage = '';

  // Combine and sort messages
  this.combineAndSortMessages();

  // Send the message via the chat service
  this.chatService.sendMessage(newMessage);
  }
}
