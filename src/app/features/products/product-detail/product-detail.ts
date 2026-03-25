import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product, ProductImage } from '../../../core/services/products';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);
  private cartService = inject(CartService);

  addedToCart = false;
  product: Product | null = null;
  selectedImage: ProductImage | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) return;

    this.productsService.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product = product;

        const primary = product.product_images.find((img) => img.is_primary);
        this.selectedImage = primary ?? product.product_images[0] ?? null;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load product', error);
      },
    });
  }

  getSelectedImageUrl(): string | null {
    return this.selectedImage ? `http://localhost:3000${this.selectedImage.image_url}` : null;
  }

  selectImage(image: ProductImage): void {
    this.selectedImage = image;
  }

  addToCart(): void {
    if (!this.product) return;
    if (this.hasReachedStockLimit()) return;

    this.cartService.addToCart(this.product);

    this.addedToCart = true;

    setTimeout(() => {
      this.addedToCart = false;
    }, 1200);
  }

  getCartQuantity(): number {
    if (!this.product) return 0;
    return this.cartService.getQuantityForProduct(this.product.id);
  }

  hasReachedStockLimit(): boolean {
    if (!this.product) return false;
    return this.getCartQuantity() >= this.product.quantity;
  }
}
