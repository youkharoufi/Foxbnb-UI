import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../Models/messages'; // Adjust the path as per your structure
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ApplicationUser } from '../Models/applicationUser';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    private hubConnection!: signalR.HubConnection;
    private messageReceivedSource = new BehaviorSubject<Message | null>(null);
    public messageReceived = this.messageReceivedSource.asObservable();

    private unreadMessagesCount = new BehaviorSubject<number>(0);
    public unreadMessagesCount$ = this.unreadMessagesCount.asObservable();

    baseUrl = environment.API_URL;

    constructor(private http : HttpClient) {
        this.buildConnection();
        this.startConnection();
    }

    updateUnreadMessagesCount(count: number) {
      this.unreadMessagesCount.next(count);
    }

    private buildConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7187/chatHub')
            .build();

        this.hubConnection.on('ReceiveMessage', (chatMessage: Message) => {
            this.messageReceivedSource.next(chatMessage);
        });
    }

    private startConnection() {
        this.hubConnection
            .start()
            .catch(err => console.error('Error while starting connection: ' + err))
    }

    public sendMessage(chatMessage: Message) {

        this.hubConnection.invoke('SendMessage', chatMessage)
            .catch(err => console.error('Error while sending message: ' + err));
    }

    getSentMessages(userId:string, receiverId:string): Observable<Message[]>{
      return this.http.get<Message[]>(this.baseUrl+"messages/get-sent-messages/"+userId+"/"+receiverId);
    }

    getReceivedMessages(senderId:string, userId:string): Observable<Message[]>{
      return this.http.get<Message[]>(this.baseUrl+"messages/get-received-messages/"+senderId+"/"+userId);
    }

    getUnreadMessagesCount(userId:string): Observable<number>{
      this.http.get<number>(this.baseUrl+"messages/unread-message-count/"+userId).subscribe({
        next:(value:number)=>{
          this.unreadMessagesCount.next(value);
        }
      })
      return this.http.get<number>(this.baseUrl+"messages/unread-message-count/"+userId);
    }

    getAllSendersUsers(userId:string): Observable<ApplicationUser[]>{
      return this.http.get<ApplicationUser[]>(this.baseUrl+"messages/all-senders-users/"+userId)
    }

    readMessages(senderId:string, receiverId:string): Observable<Message[]>{
      return this.http.post<Message[]>(this.baseUrl+"messages/read-messages/"+senderId+"/"+receiverId, {})
    }

    unreadsPerUser(senderId:string, receiverId:string): Observable<number>{
      return this.http.get<number>(this.baseUrl+"messages/unread-messages-count-per-user/"+senderId+"/"+receiverId);
    }
}
