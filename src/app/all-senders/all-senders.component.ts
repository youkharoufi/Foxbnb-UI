import { Component, OnInit } from '@angular/core';
import { ApplicationUser } from '../Models/applicationUser';
import {MatCardModule} from '@angular/material/card';
import { ChatService } from '../Services/chat.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';

export interface KeyValuePair {
  userId: string;
  count: any;
}

@Component({
  selector: 'app-all-senders',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, RouterModule, MatCardModule, MatButtonModule, MatBadgeModule],
  templateUrl: './all-senders.component.html',
  styleUrl: './all-senders.component.css'
})
export class AllSendersComponent implements OnInit{

  allSenders : ApplicationUser[] = [];
  senders : ApplicationUser[] = [];
  pageSize = 1;

  countPerUser = 0;
  unreadSenderUsers : KeyValuePair[] = [];

  constructor(private chatService: ChatService, private router: Router){}


  ngOnInit(): void{

    const localUser = JSON.parse(localStorage.getItem('user')!);

    if(localUser !== null && localUser !== undefined){
      this.chatService.getAllSendersUsers(localUser.id).subscribe({
        next:(value:ApplicationUser[])=>{
          this.senders = value;
          this.allSenders = value;
          this.updateCurrentProperties();

          this.allSenders.forEach((senderUser)=>{
            this.chatService.unreadsPerUser(senderUser.id!, localUser.id).subscribe({
              next:(value:number)=>{
                const pair : KeyValuePair = {
                  userId:senderUser.id!,
                  count:value
                }
                this.unreadSenderUsers.push(pair);
              }
            })

          })

          console.log(this.unreadSenderUsers);
        }
      });


    }

  }

  handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.allSenders = this.senders.slice(startIndex, endIndex);
  }

  private updateCurrentProperties() {
    this.allSenders = this.senders.slice(0, this.pageSize);
  }

  redirectToChat(otherUserId:string){
    this.router.navigateByUrl('/chat/'+otherUserId);
  }
}
