import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../core/services/cart';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [NgIf, NgFor, AsyncPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private cartService = inject(CartService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  cartItems$ = this.cartService.cartItems$;

  checkoutForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zip: ['', [Validators.required]],
    country: ['', [Validators.required]],
  });

  getItemCount(): number {
    return this.cartService.getItemCount();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  submit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const orderSnapshot = {
      items: this.cartService.getItems(), // you may need to add this
      total: this.cartService.getTotal(),
      count: this.cartService.getItemCount(),
    };

    sessionStorage.setItem('dirtyrips-last-order', JSON.stringify(orderSnapshot));
    sessionStorage.setItem('dirtyrips-checkout-complete', 'true');

    this.cartService.clearCart();
    this.router.navigate(['/checkout/success']);
  }

  fieldInvalid(fieldName: keyof typeof this.checkoutForm.controls): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}
