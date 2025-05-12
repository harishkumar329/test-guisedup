import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Our Products</h1>
        <div class="flex gap-4">
          <select 
            [(ngModel)]="sortBy"
            (change)="loadProducts()"
            class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>

      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
      </div>

      <div *ngIf="!loading && products.length === 0" class="text-center py-8">
        <p class="text-gray-500">No products found.</p>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  loading = false;
  sortBy = '';

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    const params: any = {};
    
    if (this.sortBy) {
      params.sortBy = this.sortBy.split('-')[0];
      params.order = this.sortBy.endsWith('-desc') ? 'DESC' : 'ASC';
    }

    this.productService.getProducts(params).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }
}