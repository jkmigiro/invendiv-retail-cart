import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductListComponent } from './product-list.component';
import { of } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getCartItems', 'addToCart', 'removeFromCart']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent,BrowserAnimationsModule],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should correctly determine if a product is in the cart', () => {
    cartServiceSpy.getCartItems.and.returnValue(of([
      { product: { id: 1, name: 'Test Product', price: 50 }, quantity: 2 }
    ]));
    
    component.isInCart({ id: 1, name: 'Test Product', price: 50 }).subscribe(inCart => {
      expect(inCart).toBeTrue();
    });
  
    component.isInCart({ id: 2, name: 'Not in Cart', price: 40 }).subscribe(inCart => {
      expect(inCart).toBeFalse();
    });
  });


  it('should toggle product in cart', () => {
    const testProduct: Product = { id: 1, name: 'Test Product', price: 50 };
      cartServiceSpy.getCartItems.and.returnValue(of([
      { product: testProduct, quantity: 2 }
    ]));
  
    component.toggleCart(testProduct);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(1);
  
    cartServiceSpy.getCartItems.and.returnValue(of([]));
  
    component.toggleCart(testProduct);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(testProduct);
  });
  
});
