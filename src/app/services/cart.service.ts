import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { Discount } from '../models/discount.model';
import { Item } from '../models/item.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Item[] = [];
  private cartItemsSubject = new BehaviorSubject<Item[]>([]);
  private appliedDiscount = new BehaviorSubject<Discount | null>(null);
  private storageService: StorageService;
  

  private availableDiscounts: Discount[] = [
    { code: 'SAVE10', type: 'percentage', value: 10 },
    { code: 'SAVE5', type: 'fixed', value: 5 }
  ];

  constructor() {
    this.storageService=inject(StorageService)
    const savedCart = this.storageService.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
    const savedDiscount = this.storageService.getItem('discount');
    if (savedDiscount) {
      this.appliedDiscount.next(JSON.parse(savedDiscount));
    }
  }

  getCartItems(): Observable<Item[]> {
    return this.cartItemsSubject.asObservable();
  }

  getAppliedDiscount(): Observable<Discount | null> {
    return this.appliedDiscount.asObservable();
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    
    this.updateCart();
  }

  removeFromCart(productId: number): Observable<Item | undefined> {
    const value=this.getProductById(productId)
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
    return value;
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  applyDiscountCode(code: string): boolean {
    const discount = this.availableDiscounts.find(
      d => d.code.toLowerCase() === code.toLowerCase()
    );
    
    if (discount) {
      this.appliedDiscount.next(discount);
      this.storageService.setItem('discount', JSON.stringify(discount));
      return true;
    }
    
    return false;
  }

  clearDiscount(): void {
    this.appliedDiscount.next(null);
    this.storageService.removeItem('discount');
  }

  getSubtotal(item: Item): number {
    return item.product.price * item.quantity;
  }

  getCartSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + this.getSubtotal(item), 0
    );
  }

  getCartTotal(): number {
    const subtotal = this.getCartSubtotal();
    const discount = this.appliedDiscount.value;
    
    if (!discount) return subtotal;
    
    if (discount.type === 'percentage') {
      return subtotal * (1 - discount.value / 100);
    } else {
      return Math.max(0, subtotal - discount.value);
    }
  }

  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.appliedDiscount.next(null);
    this.storageService.removeItem('cart');
    this.storageService.removeItem('discount');
    this.cartItemsSubject.next(this.cartItems);
  }

  private updateCart(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.storageService.setItem('cart', JSON.stringify(this.cartItems));
  }

  getProductById(productId: number): Observable<Item | undefined> {
    return this.getCartItems().pipe(
      map(items => items.find(item => item.product.id === productId))
    );
  }
}