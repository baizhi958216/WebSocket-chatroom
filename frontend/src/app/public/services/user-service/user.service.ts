import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private snackbar: MatSnackBar) {}

  create(user: UserI): Observable<UserI> {
    return this.http.post<UserI>('api/users', user).pipe(
      tap((createdUser: UserI) =>
        this.snackbar.open(`用户${createdUser.username}创建成功`, '关闭', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
      ),
      catchError((e) => {
        this.snackbar.open(`${e.error.message}`, '关闭', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        return throwError(() => new Error(e));
      })
    );
  }
}
