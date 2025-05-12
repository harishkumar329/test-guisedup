import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Wallet {
  id: string;
  balance: number;
  transactions: WalletTransaction[];
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/api/wallet`;
  private walletSubject = new BehaviorSubject<Wallet | null>(null);
  wallet$ = this.walletSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadWallet();
  }

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>(this.apiUrl).pipe(
      tap(wallet => this.walletSubject.next(wallet))
    );
  }

  addMoney(amount: number): Observable<{ message: string; balance: number; transaction: WalletTransaction }> {
    // For demo purposes, assume all transactions are successful
    return this.http.post<{ message: string; balance: number; transaction: WalletTransaction }>(
      `${this.apiUrl}/add`, 
      { amount }
    ).pipe(
      tap(response => {
        const currentWallet = this.walletSubject.value;
        if (currentWallet) {
          this.walletSubject.next({
            ...currentWallet,
            balance: response.balance
          });
        }
      })
    );
  }

  getTransactions(page: number = 1, limit: number = 10): Observable<{
    transactions: WalletTransaction[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    return this.http.get<{
      transactions: WalletTransaction[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>(`${this.apiUrl}/transactions`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  private loadWallet() {
    this.getWallet().subscribe({
      error: (error) => console.error('Error loading wallet:', error)
    });
  }
}
