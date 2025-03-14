import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Item } from '../models/item.model';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty cart initially', (done) => {
    spyOn(service, 'getCartItems').and.returnValue(of([])); 
    service.getCartItems().subscribe((items: Item[]) => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should add an item to the cart', (done) => {
    const product =  { id: 1, name: 'Nike Air Max', price: 100, imageUrl: '' }
    const item: Item ={product:product,quantity:1};

    spyOn(service, 'getCartItems').and.returnValue(of([item]));

    service.addToCart(product);
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product.name).toBe('Nike Air Max');
      done();
    });
  });
});
