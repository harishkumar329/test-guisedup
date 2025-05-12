import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold mb-4">Search Results for "{{ searchQuery }}"</h2>
      
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>

      <div *ngIf="!loading">
        <div *ngIf="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
        </div>

        <div *ngIf="products.length === 0" class="text-center py-8">
          <p class="text-gray-500">No products found matching your search.</p>
        </div>
      </div>
    </div>
  `
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  products: any[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.search();
      }
    });
  }

  private search() {
    this.loading = true;
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.loading = false;
      }
    });
  }
}
