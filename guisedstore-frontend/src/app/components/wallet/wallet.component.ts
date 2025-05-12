import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService, Wallet, WalletTransaction } from '../../services/wallet.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div *ngIf="successMessage" class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">My Wallet</h2>
          <div class="text-right">
            <p class="text-gray-600">Current Balance</p>
            <p class="text-3xl font-bold text-primary">
              {{ wallet?.balance || 0 | currency:'INR' }}
            </p>
          </div>
        </div>

        <form class="mb-6" (submit)="addMoney(); $event.preventDefault();">
          <h3 class="text-lg font-semibold mb-4">Add Money</h3>
          <div class="flex gap-4">
            <input 
              type="number" 
              [(ngModel)]="amount" 
              name="amount"
              min="1"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              placeholder="Enter amount in rupees"
              [disabled]="isLoading">
            <button 
              type="submit"
              [disabled]="!amount || amount <= 0 || isLoading"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50">
              <span *ngIf="!isLoading">Add Money</span>
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            </button>
          </div>
        </form>

        <div>
          <h3 class="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div class="space-y-4">
            <div *ngFor="let transaction of transactions" 
                [class]="'flex justify-between items-center p-4 rounded-md ' + 
                        (transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50')">
              <div>
                <p class="font-medium">{{ transaction.description }}</p>
                <p class="text-sm text-gray-600">{{ transaction.createdAt | date:'medium' }}</p>
              </div>
              <div [class]="'font-bold ' + 
                          (transaction.type === 'credit' ? 'text-green-600' : 'text-red-600')">
                {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount | currency:'INR' }}
              </div>
            </div>
          </div>

          <div *ngIf="transactions.length === 0" class="text-center py-8 text-gray-500">
            No transactions yet
          </div>

          <div *ngIf="hasMoreTransactions" class="text-center mt-4">
            <button 
              (click)="loadMoreTransactions()"
              class="text-primary hover:text-primary-dark focus:outline-none">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .bg-primary { @apply bg-blue-600; }
    .bg-primary-dark { @apply bg-blue-700; }
    .text-primary { @apply text-blue-600; }
    .border-primary { @apply border-blue-600; }
    .ring-primary { @apply ring-blue-600; }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    `
  ]
})
export class WalletComponent implements OnInit {
  wallet: Wallet | null = null;
  transactions: WalletTransaction[] = [];
  amount = 0;
  currentPage = 1;
  hasMoreTransactions = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private walletService: WalletService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadWallet();
    this.loadTransactions();

    this.route.queryParams.subscribe(params => {
      if (params['status'] === 'payment-success') {
        this.successMessage = 'Payment successful! Your order has been placed.';
        setTimeout(() => this.successMessage = null, 5000);
      } else if (params['status'] === 'payment-failed') {
        this.errorMessage = 'Payment failed. Please try again.';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  loadWallet() {
    this.walletService.wallet$.subscribe(wallet => {
      this.wallet = wallet;
    });
  }

  loadTransactions() {
    this.walletService.getTransactions(this.currentPage).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.transactions = response.transactions;
        } else {
          this.transactions = [...this.transactions, ...response.transactions];
        }
        this.hasMoreTransactions = this.currentPage < response.totalPages;
      },
      error: (error) => console.error('Error loading transactions:', error)
    });
  }

  loadMoreTransactions() {
    this.currentPage++;
    this.loadTransactions();
  }

  addMoney() {
    if (this.amount <= 0 || this.isLoading) return;

    this.isLoading = true;
    this.walletService.addMoney(this.amount).subscribe({
      next: (response) => {
        this.successMessage = `Successfully added ₹${this.amount} to your wallet. New balance: ₹${response.balance}`;
        this.amount = 0;
        this.currentPage = 1;
        this.loadTransactions();
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (error) => {
        console.error('Error adding money:', error);
        this.errorMessage = 'Failed to add money to wallet. Please try again.';
        setTimeout(() => this.errorMessage = null, 5000);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
