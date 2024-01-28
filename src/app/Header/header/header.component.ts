import { ChatService } from './../../Services/chat.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { LoginDialogComponent } from '../../Dialogs/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../../Dialogs/register-dialog/register-dialog.component';
import { UserService } from '../../Services/user.service';
import { ApplicationUser } from '../../Models/applicationUser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, MatBadgeModule, MatIconModule,
  MatButtonModule],
  providers:[UserService, provideAnimations()],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user?: ApplicationUser;
  user$ = this.userService.user$;

  unreadMessagesCount$ = this.chatService.unreadMessagesCount$;

  constructor(private dialog: MatDialog, private userService: UserService,
    private chatService: ChatService, private router: Router){}

  ngOnInit(): void{
    const userConnected = JSON.parse(localStorage.getItem('user')!);

    if(userConnected !== undefined && userConnected !== null){
      this.user = JSON.parse(localStorage.getItem('user')!);
      this.userService.updateUser(this.user!);

      this.chatService.getUnreadMessagesCount(this.user?.id!).subscribe({
        next:(value:number)=>{
          this.chatService.updateUnreadMessagesCount(value);
        }
      })


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
    this.router.navigate(['/property-list']);
  }
}
