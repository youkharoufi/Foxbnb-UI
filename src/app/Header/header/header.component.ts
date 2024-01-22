import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { LoginDialogComponent } from '../../Dialogs/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../../Dialogs/register-dialog/register-dialog.component';
import { UserService } from '../../Services/user.service';
import { ApplicationUser } from '../../Models/applicationUser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  providers:[UserService, provideAnimations()],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user?: ApplicationUser;
  user$ = this.userService.user$;

  constructor(private dialog: MatDialog, private userService: UserService){}

  ngOnInit(): void{
    const userConnected = JSON.parse(localStorage.getItem('user')!);

    if(userConnected !== undefined && userConnected !== null){
      this.user = JSON.parse(localStorage.getItem('user')!);
      this.userService.updateUser(this.user!);
    }
  }

  openLoginDialog(){
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userService.updateUser(this.user!);

    });
  }

  openRegisterDialog(){
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logout(){
    this.userService.logout();
  }
}
