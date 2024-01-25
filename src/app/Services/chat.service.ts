import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../Models/messages'; // Adjust the path as per your structure
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    private hubConnection!: signalR.HubConnection;
    private messageReceivedSource = new BehaviorSubject<Message | null>(null);
    public messageReceived = this.messageReceivedSource.asObservable();

    baseUrl = environment.API_URL;

    constructor(private http : HttpClient) {
        this.buildConnection();
        this.startConnection();
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
}
