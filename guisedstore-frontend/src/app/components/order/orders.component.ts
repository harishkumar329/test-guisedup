import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  currentPage = 1;
  hasMoreOrders = false;
  
  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders(this.currentPage).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.orders = response.orders;
        } else {
          this.orders = [...this.orders, ...response.orders];
        }
        this.hasMoreOrders = this.currentPage < response.totalPages;
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  loadMore() {
    this.currentPage++;
    this.loadOrders();
  }

  cancelOrder(orderId: string) {
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        // Refresh the current page
        const currentOrder = this.orders.find(o => o.id === orderId);
        if (currentOrder) {
          currentOrder.status = 'cancelled';
        }
      },
      error: (error) => console.error('Error cancelling order:', error)
    });
  }

  getStatusClass(status: string): string {
    const baseClasses = 'inline-block px-2 py-1 rounded-full text-xs font-medium ';
    switch (status) {
      case 'pending':
        return baseClasses + 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return baseClasses + 'bg-blue-100 text-blue-800';
      case 'completed':
        return baseClasses + 'bg-green-100 text-green-800';
      case 'cancelled':
        return baseClasses + 'bg-red-100 text-red-800';
      case 'failed':
        return baseClasses + 'bg-gray-100 text-gray-800';
      default:
        return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }
}
