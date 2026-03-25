import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../../core/services/cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [NgIf, NgFor, AsyncPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart {
  private cartService = inject(CartService);

  cartItems$ = this.cartService.cartItems$;

  getTotal(): number {
    return this.cartService.getTotal();
  }

  remove(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, qty: number): void {
    this.cartService.updateQuantity(productId, qty);
  }

  getItemCount(): number {
    return this.cartService.getItemCount();
  }
}
