import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'user_info';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    }
  }

  validateToken(token: string): Observable<boolean> {
    return this.http.post<any>(`${this.authUrl}/verify`, { token }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  private checkAuthStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      const userStr = localStorage.getItem(this.userKey);
      
      if (token && userStr) {
        this.validateToken(token).subscribe({
          next: (isValid) => {
            if (isValid) {
              const user = JSON.parse(userStr);
              this.isLoggedInSubject.next(true);
              this.userSubject.next(user);
            } else {
              this.logout();
            }
          },
          error: () => this.logout()
        });
      }
    }
  }

  signup(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/signup`, {
      name,
      email,
      password
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }
        this.isLoggedInSubject.next(true);
        this.userSubject.next(response.user);
      }),
      catchError(error => throwError(() => error))
    );
  }

  logout() {
    const token = this.getToken();
    if (token) {
      // Blacklist the token in auth service
      this.http.post(`${this.authUrl}/blacklist`, { token }).subscribe({
        complete: () => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
          }
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error during logout:', error);
          // Still clear local data even if blacklist fails
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
          }
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
}
