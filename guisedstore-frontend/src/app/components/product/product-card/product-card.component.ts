import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  quantity = 1;

  constructor(private cartService: CartService) {}

  addToCart() {
    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        // Reset quantity after adding to cart
        this.quantity = 1;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }
}
