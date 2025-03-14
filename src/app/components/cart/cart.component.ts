import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, Validators,ReactiveFormsModule,FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Discount } from '../../models/discount.model';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';
import { CartService } from '../../services/cart.service';
import {MatIconModule} from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems!: Observable<Item[]>;
  appliedDiscount$!: Observable<Discount | null>;
  submittedDiscount = false; 
  discountCode = new FormControl('', [Validators.minLength(4),this.discountValidator]);
  discountError: string | null = null;
  cartService: CartService
  displayedColumns: string[] = ['image','product', 'price', 'quantity', 'subtotal', 'actions'];
  constructor() {
    this.cartService=inject(CartService)
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.appliedDiscount$ = this.cartService.getAppliedDiscount();
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    
    if (!isNaN(quantity)) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }
  discountValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; 
    const validCodes = ['SAVE10', 'SAVE5'];
    return validCodes.includes(control.value.toUpperCase()) ? null : { invalidCode: true };
  }

  applyDiscount(): void {
    this.submittedDiscount=true

    if(this.discountCode.valid){
      const code = this.discountCode.value||'';
      const success = this.cartService.applyDiscountCode(code);
      if(success){
        this.discountError = null;
        this.discountCode.reset();
        this.submittedDiscount=false
      }
    }

  }

  get discountErrorMessage(): string {
    return this.discountCode.invalid ? `Invalid discount code: ${this.discountCode.value}` : '';
  }

  clearDiscount(): void {
    this.cartService.clearDiscount();
    this.discountCode.reset();
    this.discountError = null;
  }

  getItemSubtotal(item: Item): number {
    return this.cartService.getSubtotal(item);
  }

  getSubtotal(): number {
    return this.cartService.getCartSubtotal();
  }

  getTotal(): number {
    return this.cartService.getCartTotal();
  }

  getAmount(): number {
    return this.getSubtotal() - this.getTotal();
  }
}