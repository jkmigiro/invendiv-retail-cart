import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all products', (done) => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(12); 
      expect(products[0].name).toBe('Air Jordan 1 OG');
      done();
    });
  });

  it('should return a single product by ID', (done) => {
    service.getProduct(1).subscribe((product) => {
      expect(product).toBeTruthy();
      expect(product?.id).toBe(1);
      expect(product?.name).toBe('Air Jordan 1 OG');
      done();
    });
  });

  it('should return undefined if product ID does not exist', (done) => {
    service.getProduct(999).subscribe((product) => {
      expect(product).toBeUndefined();
      done();
    });
  });

  it('should return products that match the search term', (done) => {
    service.searchProducts('Nike').subscribe((products) => {
      expect(products.length).toBeGreaterThan(0);
      expect(products.every(p => p.name.includes('Nike'))).toBeTrue();
      done();
    });
  });

  it('should return all products if search term is empty', (done) => {
    service.searchProducts('').subscribe((products) => {
      expect(products.length).toBe(12); 
      done();
    });
  });

  it('should return no products if no match is found', (done) => {
    service.searchProducts('XYZ').subscribe((products) => {
      expect(products.length).toBe(0);
      done();
    });
  });
});
