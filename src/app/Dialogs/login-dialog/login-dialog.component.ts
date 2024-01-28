import { UserService } from './../../Services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, Inject, ViewChild } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { LoginUser } from '../../Models/login-user';
import { ApplicationUser } from '../../Models/applicationUser';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatFormFieldModule, MatButtonModule, MatDialogModule, MatInputModule, FormsModule],
  providers:[UserService, provideAnimations()],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css'
})
export class LoginDialogComponent {

  loginUser: LoginUser = {
    email:'',
    password:''
  }

  @ViewChild('loginForm') loginForm!: NgForm;


  constructor(private userService: UserService, public dialogRef: MatDialogRef<LoginDialogComponent>,
    private _snackBar: MatSnackBar, private chatService: ChatService){}


  openSnackBarSuccess() {
    this._snackBar.open('Login Successful !', 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openSnackBarError() {
    this._snackBar.open('Oops ! Wrong credentials...', 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  login(){

    this.userService.login(this.loginUser).subscribe({
      next:(value:ApplicationUser)=>{


        this.chatService.getUnreadMessagesCount(value?.id!).subscribe({
          next:(value:number)=>{
            this.chatService.updateUnreadMessagesCount(value);
          }
        })

        this.onNoClick();
        this.openSnackBarSuccess();
      },
      error:()=>{
        this.openSnackBarError()
      }
    })
  }
}
