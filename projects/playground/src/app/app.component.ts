import { NgxIndexedDBService } from './../../../ngx-indexed-db/src/lib/ngx-indexed-db.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'playground';
  storeName: string;

  constructor(private dbService: NgxIndexedDBService) {}

  add(): void {
    this.dbService
      .add('people', {
        name: `charles number ${Math.random() * 10}`,
        email: `email number ${Math.random() * 10}`,
      })
      .subscribe((result) => {
        console.log('result: ', result);
      });
  }

  addItem(): void {
    this.dbService
      .addItem('people', {
        name: `charles number ${Math.random() * 10}`,
        email: `email number ${Math.random() * 10}`,
      })
      .subscribe((result) => {
        console.log('result: ', result);
      });
  }

  bulkAdd(): void {
    this.dbService
      .bulkAdd('people', [
        {
          name: `charles number ${Math.random() * 10}`,
          email: `email number ${Math.random() * 10}`,
        },
        {
          name: `charles number ${Math.random() * 10}`,
          email: `email number ${Math.random() * 10}`,
        },
      ])
      .subscribe((result) => {
        console.log('result: ', result);
      });
  }

  bulkGet(): void {
    for (let i = 0; i < 3; i++) {
      this.bulkAdd();
    }
    this.dbService.bulkGet('people', [1, 3, 5]).subscribe((result) => {
      console.log('results: ', result);
    });
  }

  update(): void {
    this.dbService.update('people', { id: 1, email: 'asd', name: 'charles' }).subscribe((result) => {
      console.log('result: ', result);
    });
  }

  delete(): void {
    this.dbService.delete('people', 3).subscribe((result) => {
      console.log('result: ', result);
    });
  }

  clean(): void {
    this.dbService.clear('people').subscribe((result) => {
      console.log('result: ', result);
    });
  }

  count(): void {
    this.dbService.count('people').subscribe((result) => {
      console.log('result: ', result);
    });
  }

  createStote(storeName: string): void {
    console.log('storeName', storeName);
    const storeSchema = {
      store: storeName,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: false } },
      ],
    };

    this.dbService.createObjectStore(storeSchema);
  }

  addTwoAndGetAllByIndex(): void {
    // #209 getAllByIndex with multiple result should resolve observable
    forkJoin([
      this.dbService.add('people', {
        name: `desmond`,
        email: `email number ${Math.random() * 10}`,
      }),
      this.dbService.add('people', {
        name: `desmond`,
        email: `email number ${Math.random() * 10}`,
      }),
    ])
      .pipe(switchMap(() => this.dbService.getAllByIndex('people', 'name', IDBKeyRange.only('desmond'))))
      .subscribe((result) => console.log(result));
  }
}
