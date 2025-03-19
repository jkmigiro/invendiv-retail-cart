import { Component, OnInit, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule
    ],
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    products$!: Observable<Product[]>;
    searchControl = new FormControl('');
    productService: ProductService;
    cartService: CartService;
    constructor(private snackBar: MatSnackBar) {
        this.productService = inject(ProductService)
        this.cartService = inject(CartService)
    }

    ngOnInit(): void {
        this.searchControl.valueChanges.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            switchMap(term => this.productService.searchProducts(term || ''))
        ).subscribe(products => {
            this.products$ = of(products);
        });

        this.products$ = this.productService.getProducts();
    }

    addToCart(product: Product): void {
        this.cartService.addToCart(product);
    }
    isInCart = (product: Product) => {
        return this.cartService.getCartItems().pipe(
          map(items => {
            const found = items.some(item => item.product.id === product.id);
            return found;
          })
        );
      };

      test(){
        return of(true)
      }
      

      toggleCart(product: Product) {
        this.isInCart(product).pipe(first()).subscribe(inCart => {
          if (inCart) {
            this.cartService.removeFromCart(product.id);
            this.showNotification(`${product.name} removed from cart`);
          } else {
            this.cartService.addToCart(product);
            this.showNotification(`${product.name} added to cart`);
          }
        });
      }
      

    showNotification(message: string) {
        this.snackBar.open(message, 'Close', { duration: 2000 });
    }

}