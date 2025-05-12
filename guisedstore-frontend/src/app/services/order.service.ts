import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  productSnapshot: {
    name: string;
    description: string;
    category: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  createOrder(): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, {});
  }

  getOrders(page: number = 1, limit: number = 10): Observable<{
    orders: Order[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    return this.http.get<{
      orders: Order[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>(this.apiUrl, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  cancelOrder(id: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
