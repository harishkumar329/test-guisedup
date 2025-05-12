import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { Product, ProductService } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartResponse {
  cart: {
    items: CartItem[];
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/api/cart`;
  private cartUpdatedSource = new BehaviorSubject<void>(undefined);
  cartUpdated = this.cartUpdatedSource.asObservable();
  private localCart: CartItem[] = [];

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLocalCart();
    }
  }

  private loadLocalCart() {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.localCart = JSON.parse(savedCart);
      }
    }
  }

  private saveLocalCart() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.localCart));
      this.cartUpdatedSource.next();
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartResponse>(this.apiUrl).pipe(
      map(response => response.cart.items || []),
      catchError(() => of(this.localCart))
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/items`, { productId, quantity }).pipe(
      tap(() => this.cartUpdatedSource.next()),
      catchError(() => {
        const existingItem = this.localCart.find(item => item.product.id === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          // TODO: Get product details from ProductService
          this.localCart.push({ product: { id: productId } as Product, quantity });
        }
        this.saveLocalCart();
        return of(undefined);
      })
    );
  }

  updateItemQuantity(productId: string, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/items/${productId}`, { quantity }).pipe(
      tap(() => this.cartUpdatedSource.next()),
      catchError(() => {
        const item = this.localCart.find(item => item.product.id === productId);
        if (item) {
          item.quantity = quantity;
          this.saveLocalCart();
        }
        return of(undefined);
      })
    );
  }

  removeFromCart(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${productId}`).pipe(
      tap(() => this.cartUpdatedSource.next()),
      catchError(() => {
        this.localCart = this.localCart.filter(item => item.product.id !== productId);
        this.saveLocalCart();
        return of(undefined);
      })
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.cartUpdatedSource.next())
    );
  }
}
