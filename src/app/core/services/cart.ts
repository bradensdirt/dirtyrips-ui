import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './products';

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  stockQuantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private storageKey = 'dirtyrips-cart';

  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cartItems$ = this.cartItemsSubject.asObservable();

  getItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  addToCart(product: Product): void {
    const currentItems = [...this.cartItemsSubject.value];

    const existingItem = currentItems.find((item) => item.productId === product.id);

    const primary = product.product_images.find((img) => img.is_primary);
    const fallback = product.product_images[0];
    const image = primary ?? fallback;

    if (existingItem) {
      if (existingItem.quantity >= existingItem.stockQuantity) {
        return;
      }

      existingItem.quantity += 1;
    } else {
      if (product.quantity <= 0) {
        return;
      }

      currentItems.push({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: Number(product.price),
        imageUrl: image ? `http://localhost:3000${image.image_url}` : null,
        quantity: 1,
        stockQuantity: product.quantity,
      });
    }

    this.updateCart(currentItems);
  }

  removeFromCart(productId: string): void {
    const updatedItems = this.cartItemsSubject.value.filter((item) => item.productId !== productId);

    this.updateCart(updatedItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const updatedItems = this.cartItemsSubject.value.map((item) => {
      if (item.productId !== productId) return item;

      const safeQuantity = Math.min(quantity, item.stockQuantity);
      return { ...item, quantity: safeQuantity };
    });

    this.updateCart(updatedItems);
  }

  getQuantityForProduct(productId: string): number {
    const item = this.cartItemsSubject.value.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getTotal(): number {
    return this.cartItemsSubject.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private updateCart(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  private loadCart(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }
}
