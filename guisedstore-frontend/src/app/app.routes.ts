import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SearchResultsComponent } from './components/product/search-results/search-results.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { OrdersComponent } from './components/order/orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'categories', component: ProductListComponent },
  { path: 'search', component: SearchResultsComponent },
  // { path: 'products/:id', component: ProductDetailComponent },
  // { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'orders', component: OrdersComponent },
];
