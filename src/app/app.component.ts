import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ChatService } from './Services/chat.service';
import { Message } from './Models/messages';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Header/header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './Services/user.service';
import { routes } from './app.routes';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public messages: Message[] = [];
  messageContent = '';

    constructor(private chatService: ChatService) {}

    ngOnInit() {

        this.chatService.messageReceived.subscribe(message => {
            if (message) {
              console.log(message)
                this.messages.push(message);
            }
        });
    }

    public sendMessage(content: string) {
      const message : Message = {
        id:uuidv4(),
        senderId:'6bf26952-f716-40c7-83ed-5b695f06881c',
        receiverId:'0020216b-7473-491c-b131-2d6d5040c09a',
        dateSent: new Date(),
        content:content,
        read:false
      }
        this.chatService.sendMessage(message);
    }
}
