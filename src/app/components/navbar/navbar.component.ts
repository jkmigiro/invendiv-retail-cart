import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports:[CommonModule,MatToolbar,MatIcon,MatBadge,RouterLink,MatButtonModule]
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
  }
}
