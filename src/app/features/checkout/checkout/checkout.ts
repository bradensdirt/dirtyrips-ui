import { Component, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CartService } from '../../../core/services/cart';
import { Router, RouterLink } from '@angular/router';
import { CreateOrderPayload } from '../../../core/services/orders';
import { autofill } from '@mapbox/search-js-web';
import { environment } from '../../../../environments/environment';

const US_STATE_CODES = new Set([
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC',
  ]);

function usStateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim().toUpperCase();

    if (!value) {
      return null;
    }

    return US_STATE_CODES.has(value) ? null : { invalidUsState: true };
  };
}

function usZipValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();

    if (!value) {
      return null;
    }

    return /^\d{5}(-\d{4})?$/.test(value) ? null : { invalidUsZip: true };
  };
}

function usPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();

    if (!value) {
      return null;
    }

    const digitsOnly = value.replace(/\D/g, '');

    const isValid =
      digitsOnly.length === 10 || (digitsOnly.length === 11 && digitsOnly.startsWith('1'));

    return isValid ? null : { invalidUsPhone: true };
  };
}

@Component({
  selector: 'app-checkout',
  imports: [NgIf, NgFor, AsyncPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements AfterViewInit, OnDestroy {
  private cartService = inject(CartService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private autofillCollection: { remove: () => void } | null = null;

  cartItems$ = this.cartService.cartItems$;

  checkoutForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, usPhoneValidator()]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required, usStateValidator()]],
    zip: ['', [Validators.required, usZipValidator()]],
    country: ['US', [Validators.required]],
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

    const payload = this.buildOrderPayload();

    console.log('Create order payload:', payload);

    const orderSnapshot = {
      items: this.cartService.getItems(),
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

  buildOrderPayload(): CreateOrderPayload {
    const formValue = this.checkoutForm.getRawValue();
    const cartItems = this.cartService.getItems();

    return {
      customer: {
        firstName: formValue.firstName ?? '',
        lastName: formValue.lastName ?? '',
        email: formValue.email ?? '',
        phone: (formValue.phone ?? '').replace(/\D/g, ''),
      },
      shippingAddress: {
        addressLine1: formValue.address ?? '',
        addressLine2: '',
        city: formValue.city ?? '',
        state: formValue.state ?? '',
        postalCode: formValue.zip ?? '',
        country: formValue.country ?? '',
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
  }

  ngAfterViewInit(): void {
    this.autofillCollection = autofill({
      accessToken: environment.mapboxPublicToken,
      options: {
        country: 'US',
      },
    });

    const address = document.getElementById('address') as HTMLInputElement | null;
    const city = document.getElementById('city') as HTMLInputElement | null;
    const state = document.getElementById('state') as HTMLInputElement | null;
    const zip = document.getElementById('zip') as HTMLInputElement | null;
    const country = document.getElementById('country') as HTMLInputElement | null;

    const syncForm = () => {
      this.checkoutForm.patchValue({
        address: address?.value ?? '',
        city: city?.value ?? '',
        state: state?.value?.toUpperCase() ?? '',
        zip: zip?.value ?? '',
        country: country?.value ?? '',
      });
    };

    address?.addEventListener('change', syncForm);
    city?.addEventListener('change', syncForm);
    state?.addEventListener('change', syncForm);
    zip?.addEventListener('change', syncForm);
    country?.addEventListener('change', syncForm);

    address?.addEventListener('input', syncForm);
    city?.addEventListener('input', syncForm);
    state?.addEventListener('input', syncForm);
    zip?.addEventListener('input', syncForm);
    country?.addEventListener('input', syncForm);
  }

  ngOnDestroy(): void {
    this.autofillCollection?.remove();
  }
}
