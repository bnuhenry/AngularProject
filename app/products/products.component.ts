import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private auth:AuthGuard) { }

  ngOnInit(): void {
  }

  logout():void{
    this.auth.logout();
  }

}
