import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-widget.component.html',
  styleUrl: './cart-widget.component.scss'
})
export class CartWidgetComponent implements OnInit {
  cartItems: CartItem[] = []; // Initialize as empty array
  isCartOpen = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    this.cartService.cartUpdated.subscribe(() => {
      this.loadCart();
    });
  }

  get cartCount(): number {
    return this.cartItems?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;
  }

  get cartTotal(): number {
    return this.cartItems?.reduce((total, item) => total + ((item?.product?.price || 0) * (item?.quantity || 0)), 0) || 0;
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.updateItemQuantity(item.product.id, newQuantity).subscribe(() => {
        this.loadCart();
      });
    } else {
      this.cartService.removeFromCart(item.product.id).subscribe(() => {
        this.loadCart();
      });
    }
  }

  checkout() {
    this.router.navigate(['/checkout']);
    this.isCartOpen = false;
  }

  private loadCart() {
    this.cartService.getCart().subscribe({
      next: (items) => {
        if (Array.isArray(items)) {
          this.cartItems = items;
        } else {
          console.error('Received invalid cart items:', items);
          this.cartItems = [];
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.cartItems = []; // Reset to empty array on error
      }
    });
  }
}
