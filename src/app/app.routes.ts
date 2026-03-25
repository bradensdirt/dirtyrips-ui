import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home';
import { ProductListComponent } from './features/products/product-list/product-list';
import { ProductDetailComponent } from './features/products/product-detail/product-detail';
import { Shows } from './features/shows/shows/shows';
import { About } from './features/about/about/about';
import { Contact } from './features/contact/contact/contact';
import { Cart } from './features/cart/cart/cart';
import { Checkout } from './features/checkout/checkout/checkout';
import { CheckoutSuccess } from './features/checkout-success/checkout-success/checkout-success';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ProductListComponent },
  { path: 'shop/:slug', component: ProductDetailComponent },
  { path: 'shows', component: Shows },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'checkout/success', component: CheckoutSuccess },
];
