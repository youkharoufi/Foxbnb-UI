export interface RegisterUser{
  userName:string;
  firstname:string;
  lastname:string;
  phoneNumber:string;
  email:string;
  password:string;
  passwordConfirmation:string;
  profilePic?:File;
  roleName:string;
}
