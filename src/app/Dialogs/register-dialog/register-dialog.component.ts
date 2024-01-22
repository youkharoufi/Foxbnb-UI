import { UserService } from './../../Services/user.service';
import { Component } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { RegisterUser } from '../../Models/registerUser'
import { ApplicationUser } from '../../Models/applicationUser';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [ CommonModule, MatSelectModule, MatButtonModule, MatFormFieldModule,MatDialogModule, MatInputModule, FormsModule],
  providers:[UserService],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.css'
})
export class RegisterDialogComponent {

  registerUser: RegisterUser = {
  userName: '' ,
  firstname: '' ,
  lastname: '' ,
  phoneNumber: '' ,
  email: '' ,
  password: '' ,
  passwordConfirmation: '' ,
  roleName: '' ,
  }


  registerForm!: NgForm;

  selectedFile!:File;

  constructor(private userService: UserService, public dialogRef: MatDialogRef<RegisterDialogComponent>,
    private _snackBar: MatSnackBar){}


  openSnackBarSuccess() {
    this._snackBar.open('Registering Successful !', 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openSnackBarError() {
    this._snackBar.open('Oops ! An error occured', 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
        this.selectedFile = input.files[0];
    } else {
        // Handle the case where no file was selected
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  register(){
    const formData = new FormData();

    formData.append('email', this.registerUser.email);
    formData.append('profilePic', this.selectedFile!, this.selectedFile!.name);
    formData.append('firstname', this.registerUser.firstname);
    formData.append('userName', this. registerUser.userName);
    formData.append('phoneNumber', this. registerUser.phoneNumber);
    formData.append('lastname', this.registerUser.lastname);
    formData.append('roleName', this.registerUser.roleName);
    formData.append('password', this.registerUser.password);
    formData.append('passwordConfirmation', this.registerUser.passwordConfirmation);

    this.userService.register(formData).subscribe({
      next:(value:ApplicationUser)=>{
        this.onNoClick();
        this.openSnackBarSuccess();
      },
      error:()=>{
        this.openSnackBarError();
      }
    })
  }
}
