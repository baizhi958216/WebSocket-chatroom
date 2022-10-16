import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { LoginResponseI } from 'src/app/model/login-response.interface';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private snackbar: MatSnackBar,private jwtServer:JwtHelperService) {}

  login(user: UserI): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>('api/users/login', user).pipe(
      tap((res: LoginResponseI) =>
        localStorage.setItem('nest_chat_app', res.access_token)
      ),
      tap(() =>
        this.snackbar.open('登录成功', '关闭', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
      )
    );
  }

  getLoggedInUser(){
    const decodedToken = this.jwtServer.decodeToken();
    console.log(decodedToken.user);
    return decodedToken.user;
  }
}
