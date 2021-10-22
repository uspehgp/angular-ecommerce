import {Component, OnInit} from '@angular/core';
import {ProductCategory} from "../../common/product-category";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] | undefined;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.listProductCategories()
  }

  private listProductCategories(){
    // @ts-ignore
    this.productService.getProductCategories().subscribe(
        (data: ProductCategory[] | undefined) => {
        console.log('Product Categories' + JSON.stringify(data));
        this.productCategories = data;
      }
    )
  }
}
