import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WalletService } from '../../services/wallet.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  walletBalance: number = 0;
  subtotal: number = 0;
  total: number = 0;

  constructor(
    private cartService: CartService,
    private walletService: WalletService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    this.loadWallet();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotals();
      },
      error: (error) => console.error('Error loading cart:', error)
    });
  }

  loadWallet() {
    this.walletService.wallet$.subscribe(wallet => {
      this.walletBalance = wallet?.balance || 0;
    });
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );
    this.total = this.subtotal; // Add shipping or other costs if needed
  }

  navigateToWallet() {
    this.router.navigate(['/wallet']);
  }

  placeOrder() {
    if (this.walletBalance < this.total) {
      return;
    }

    this.orderService.createOrder().subscribe({
      next: (order) => {
        // Clear the cart after successful order creation
        this.cartService.clearCart().subscribe(() => {
          // Navigate to order confirmation with success status
          this.router.navigate(['/orders', order.id], { 
            queryParams: { status: 'success' }
          });
        });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        // Navigate back to wallet with error status
        this.router.navigate(['/wallet'], {
          queryParams: { status: 'payment-failed' }
        });
      }
    });
  }
}
