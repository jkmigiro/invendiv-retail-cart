import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Air Jordan 1 OG',
      price: 45,
      imageUrl: '/images/shoe-1-Air-Jordan-1-OG-45.jpg'
    },
    {
      id: 2,
      name: 'Nike Air Max 1 Ultra',
      price: 60,
      imageUrl: '/images/shoe-2-Nike-Air-Max-1Ultra-60.jpg'
    },
    {
      id: 3,
      name: 'Nike Air Force 1 PRM',
      price: 95,
      imageUrl: '/images/shoe-3-Nike-Air-Force-1-PRM-95.jpg'
    },
    {
      id: 4,
      name: 'CR Terrati',
      price: 60,
      imageUrl: '/images/shoe-4-CR-Terrati-60.jpg'
    },
    {
      id: 5,
      name: 'Jordan 12 Retro',
      price: 60,
      imageUrl: '/images/shoe-5-Jordan-12-Retro-Gym-Red-2018-60.jpg'
    },
    {
      id: 6,
      name: 'Puma RS-X3 Marshmallow',
      price: 35,
      imageUrl: '/images/shoe-6-Puma-RS-X3-Layers-Marshmallow-32.jpg'
    },
    {
      id: 12,
      name: 'John Foster Leather',
      price: 50,
      imageUrl: '/images/shoe-12-John-Foster-Leather-50.jpg'
    },
    {
      id: 8,
      name: 'Nike SUPPEREP GO',
      price: 100,
      imageUrl: '/images/shoe-8-Nike-SUPERREP-GO-100.jpg'
    },
    {
      id: 9,
      name: 'Adidas Continental',
      price: 70,
      imageUrl: '/images/shoe-9-Adidas-Continental-80-70.jpg'
    },
    {
      id: 10,
      name: 'Suga Leather',
      price: 80,
      imageUrl: '/images/shoe-10-Suga-Leather-80.jpg'
    },
    {
      id: 11,
      name: 'Vans Authentic',
      price: 25,
      imageUrl: '/images/shoe-13-Vans-Authentic-25.jpg'
    },
    {
      id: 13,
      name: 'Frank Barker Loafer',
      price: 120,
      imageUrl: '/images/shoe-14-Frank-Barker-Loafer-120.jpg'
    }
  ];
  

  constructor() {}

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProduct(id: number): Observable<Product | undefined> {
    return of(this.products.find(product => product.id === id));
  }

  searchProducts(term: string): Observable<Product[]> {
    if (!term.trim()) {
      return of(this.products);
    }
    
    const filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    
    return of(filteredProducts);
  }
}

