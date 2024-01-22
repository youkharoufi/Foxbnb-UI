import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../Models/messages'; // Adjust the path as per your structure

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    private hubConnection!: signalR.HubConnection;
    private messageReceivedSource = new BehaviorSubject<Message | null>(null);
    public messageReceived = this.messageReceivedSource.asObservable();

    constructor() {
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
}
