import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

export interface AuthResponceData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable()
export class AuthService{

  user = new BehaviorSubject<User|null>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) {}

  signUp(email: string, password: string){
    return this.http.post<AuthResponceData>
    ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
         catchError(this.handelError), tap(resData => {this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)})
      );
  }

  login(email: string, password: string){
    return this.http.post<AuthResponceData>
    ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
         catchError(this.handelError), tap(resData => {this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)})
      );
  }

  autoLogin() {
    const userData: {
      email:string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')!);

    if (!userData){
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
         new Date(userData._tokenExpirationDate).getTime() -
         new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userID: string, token: string, expiresIn: number) {

      const expiratiionDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user = new User(email, userID, token, expiratiionDate);

            this.user.next(user);
            this.autoLogout(expiresIn * 1000);
            localStorage.setItem('userData', JSON.stringify(user));
    }


  private handelError(errorRes: HttpErrorResponse) {

      let errorMessage = 'An Unknown Error Message Occoured';

        if(!errorRes.error || !errorRes.error.error){
          return throwError(errorMessage);
        }

        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This Email Already Exists';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'This Email Does Not Exists';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'This Password Is Invalid';
            break;
        }
        return throwError(errorMessage);

  }

}
