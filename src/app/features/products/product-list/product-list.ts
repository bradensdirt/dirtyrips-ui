import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ProductsService, Product } from '../../../core/services/products';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];

  ngOnInit(): void {
    this.productsService.getPublicProducts().subscribe({
      next: (response) => {
        this.products = response.data;

        this.cdr.detectChanges(); // 👈 FIX
      },
      error: (error) => {
        console.error('Failed to load products', error);
      },
    });
  }

  getPrimaryImage(product: Product): string | null {
    const primary = product.product_images.find((img) => img.is_primary);
    const fallback = product.product_images[0];
    const image = primary ?? fallback;

    return image ? `http://localhost:3000${image.image_url}` : null;
  }
}
