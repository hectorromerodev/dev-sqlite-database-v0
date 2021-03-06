import { Component, OnInit } from '@angular/core';
import { Dev, DatabaseService } from 'src/app/services/database.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.page.html',
  styleUrls: ['./developers.page.scss'],
})
export class DevelopersPage implements OnInit {
  developers: Dev[] = [];

  products: Observable<any[]>;

  developer: any = {};
  product: any = {};

  selectedView = 'devs';

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.getDevs().subscribe(devs => {
          this.developers = devs;
        });
        this.product = this.db.getProducts();
      }
    });
  }

  addDeveloper() {
    let skills = this.developer.skills.split(',');
    skills = skills.map(skill => skill.trim());
    this.db.addDeveloper(this.developers['name'], skills, this.developers['img'])
      .then(() => {
        this.developer = {};
      });
  }

  addProduct() {
    this.db.addProduct(this.product.name, this.product.creator)
      .then(() => {
        this.product = {};
      });
  }

}
