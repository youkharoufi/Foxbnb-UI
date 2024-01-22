export interface Message {
  senderId:string;
  receiverId:string;
  dateSent:Date;
  content:string;
  read:boolean;
}
