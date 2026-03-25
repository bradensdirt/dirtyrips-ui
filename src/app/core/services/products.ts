import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
  alt_text: string | null;
  is_primary: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: string;
  quantity: number;
  product_type: string;
  category: string;
  status: string;
  product_images: ProductImage[];
  card_details: any;
  grading_details: any;
  sports_card_details: any;
  tcg_card_details: any;
  sealed_product_details: any;
}

export interface PublicProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/products';

  getPublicProducts(): Observable<PublicProductsResponse> {
    return this.http.get<PublicProductsResponse>(`${this.baseUrl}/public`);
  }
  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${slug}`);
  }
}


