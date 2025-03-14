import { Component, OnInit, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
        MatButtonModule
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
    constructor() {
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
}