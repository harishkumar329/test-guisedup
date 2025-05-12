import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SearchResponse {
  products: Product[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  getProducts(params?: {
    category?: string,
    sortBy?: string,
    order?: 'ASC' | 'DESC',
    minPrice?: number,
    maxPrice?: number,
  }): Observable<Product[]> {
    return this.http.get<{products: Product[]}>(
      `${this.apiUrl}/products`,
      { params: params as any }
    ).pipe(
      map(response => response.products)
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/products/categories`);
  }

  searchProducts(query: string): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.apiUrl}/products/search`, {
      params: { query }
    });
  }
}
