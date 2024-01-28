import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private snackBar:MatSnackBar){}

  canActivate(): boolean {
    const isLoggedIn = JSON.parse(localStorage.getItem('user')!)

    if (!isLoggedIn) {

      this.snackBar.open('Oops ! Access denied, please log in first', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration:5000
      });
      this.router.navigate(['/property-list']);
      return false;
    }

    return true;
  }
}

