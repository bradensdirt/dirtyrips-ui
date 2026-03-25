import { Component } from '@angular/core';
import { CartService } from './core/services/cart';
import { inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { map } from 'rxjs';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private cartService = inject(CartService);

  cartCount$ = this.cartService.cartItems$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.quantity, 0)),
  );
}
