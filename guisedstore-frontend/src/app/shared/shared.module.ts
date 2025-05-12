import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from '../components/layout/header/header.component';
import { FooterComponent } from '../components/layout/footer/footer.component';
import { ProductCardComponent } from '../components/product/product-card/product-card.component';
import { ProductListComponent } from '../components/product/product-list/product-list.component';
import { CartWidgetComponent } from '../components/cart/cart-widget/cart-widget.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    ProductListComponent,
    CartWidgetComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    ProductListComponent,
    CartWidgetComponent,
  ]
})
export class SharedModule { }
