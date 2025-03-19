import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { CartComponent } from './cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CartComponent', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let cartServiceSpy: jasmine.SpyObj<CartService>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(async () => {
        cartServiceSpy = jasmine.createSpyObj('CartService', ['getCartItems', 'removeFromCart', 'updateQuantity']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        await TestBed.configureTestingModule({
            imports: [CartComponent,BrowserAnimationsModule],
            providers: [
                { provide: CartService, useValue: cartServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
    });

    it('should remove item from cart', () => {
        component.removeItem(1);
        expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(1);
    });

    it('should update quantity', () => {
        const event = { target: { value: '3' } } as unknown as Event;
        component.updateQuantity(1, event);
        expect(cartServiceSpy.updateQuantity).toHaveBeenCalledWith(1, 3);
    });

});
