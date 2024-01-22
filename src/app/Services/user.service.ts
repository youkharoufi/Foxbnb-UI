import { ApplicationUser } from './../Models/applicationUser';
import { LoginUser } from './../Models/login-user';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegisterUser } from '../Models/registerUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl= environment.API_URL;
  private user = new BehaviorSubject<ApplicationUser | null>(null);
  public user$ = this.user.asObservable();

  constructor(private http: HttpClient) { }

  updateUser(user:ApplicationUser){
    this.user.next(user);
  }

  login(loginUser: LoginUser): Observable<ApplicationUser>{
    return this.http.post<ApplicationUser>(this.baseUrl + "usersManagement/login", loginUser).pipe(
      tap((user: ApplicationUser) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.user.next(user);
      })
    );
  }

  register(registerUser: FormData): Observable<ApplicationUser>{
    return this.http.post<ApplicationUser>(this.baseUrl+"usersManagement/register", registerUser);
  }

  logout(){
    localStorage.removeItem('user');
    this.user.next(null);
  }
}
