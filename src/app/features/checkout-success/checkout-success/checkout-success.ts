import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink, NgIf],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
})
export class CheckoutSuccess implements OnInit {
  private router = inject(Router);

  orderNumber = '';
  order: {
    items: any[];
    total: number;
    count: number;
  } | null = null;

  ngOnInit(): void {
    const checkoutComplete = sessionStorage.getItem('dirtyrips-checkout-complete');

    if (checkoutComplete !== 'true') {
      this.router.navigate(['/cart']);
      return;
    }

    const storedOrder = sessionStorage.getItem('dirtyrips-last-order');
    if (storedOrder) {
      this.order = JSON.parse(storedOrder);
    }

    const existingOrderNumber = sessionStorage.getItem('dirtyrips-order-number');

    if (existingOrderNumber) {
      this.orderNumber = existingOrderNumber;
    } else {
      this.orderNumber = `DR-${Math.floor(100000 + Math.random() * 900000)}`;
      sessionStorage.setItem('dirtyrips-order-number', this.orderNumber);
    }

    sessionStorage.removeItem('dirtyrips-checkout-complete');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
