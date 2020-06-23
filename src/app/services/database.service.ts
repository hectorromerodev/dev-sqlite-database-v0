import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  developers = new BehaviorSubject([]);
  products = new BehaviorSubject([]);

  constructor(
    private platform: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    // Check if our platform is ready to use it
    this.platform.ready()
      .then(() => {
        // Create database locally
        this.sqlite.create({
          name: 'developers.db',
          location: 'default'
        })
          .then((db: SQLiteObject) => {
            this.database = db;
            this.seedDatabase(); // Add dummy data
          });
      });
  }

  seedDatabase() {
    this.http.get('../../assets/seed.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(() => {
            this.loadDevelopers();
            this.loadProducts();
            this.dbReady.next(true);
          })
          .catch(e => console.log(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getDevs(): Observable<Dev[]> {
    return this.developers.asObservable();
  }

  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }

  loadDevelopers() {
    const query = 'SELECT * FROM developer';
    return this.database.executeSql(query, [])
      .then(data => {
        const developers: Dev[] = [];
        if (data.rows.lengt > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let skills = [];
            if (data.rows.item(i).skills !== '') {
              skills = JSON.parse(data.rows().item(i).skills);
            }
            developers.push({
              id: data.rows.item(i).id,
              name: data.rows.item(i).name,
              skills: data.rows.item(i).skills,
              img: data.rows.item(i).img
            });
          }
        }
        this.developers.next(developers);
      });
  }

  addDeveloper(name, skills, img) {
    let data = [name, JSON.stringify(skills), img];
    const query = 'INSERT INTO developer (name, skills, img) VALUES (?, ?, ?)';
    return this.database.executeSql(query, data)
      .then(() => {
        this.loadDevelopers();
      });
  }

  getDeveloper(id): Promise<Dev> {
    const query = 'SELECT * FROM developer WHERE id = ?';
    return this.database.executeSql(query, [id])
      .then(data => {
        let skills = [];
        if (data.rows.item(0).skills !== '') {
          skills = JSON.parse(data.rows.item(0).skills);
        }
        return {
          id: data.rows.item(0).id,
          name: data.rows.item(0).name,
          skills,
          img: data.rows.item(0).img
        }
      });
  }

  deleteDeveloper(id) {
    const query = 'DELETE FROM developer WHERE id = ?';
    return this.database.executeSql(query, [id])
      .then(_ => {
        this.loadDevelopers();
        this.loadProducts();
      });
  }

  updateDeveloper(dev: Dev) {
    let data = [dev.name, JSON.stringify(dev.skills), dev.img];
    const query = `UPDATE developer SET name = ?, img = ?, WHERE id = ${dev.id}`;
    return this.database.executeSql(query, data)
      .then(() => {
        this.loadDevelopers();
      });
  }

  loadProducts() {
    const query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN ON developer.id = product.creatorId';
    return this.database.executeSql(query, []).then(data => {
      const products = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          products.push({
            name: data.rows.item(i).name,
            id: data.rows.item(i).id,
            creator: data.rows.item.item(i).creator
          });
        }
      }
      this.products.next(products);
    });
  }

  addProduct(name, creator) {
    let data = [name, creator];
    return this.database.executeSql('INSERT INTO product (name, creatorId) VALUES (?, ?)', data)
      .then(() => {
        this.loadProducts();
      });
  }

}

export interface Dev {
  id: number;
  name: string;
  skills: any[];
  img: string;
}
