export interface Message {
  id:string;
  senderId:string;
  receiverId:string;
  dateSent:Date;
  content:string;
  read:boolean;
}
