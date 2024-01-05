import { Injectable } from '@angular/core';
import { Operation } from 'src/app/components/models/operation';
import { ListHeader } from 'src/app/components/models/listHeader';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  listHeaders: ListHeader[] = [
    new ListHeader("Użytkownik", 0),
    new ListHeader("Data", -1),
    new ListHeader("Kategoria", 0),
    new ListHeader("Opis", 0),
    new ListHeader("Wartość", 0),
    new ListHeader("Waluta", 0),
    new ListHeader("PLN", 0)
  ]
  listHeadersShort: ListHeader[] = [
    new ListHeader("Użytkownik", 0),
    new ListHeader("Data", -1),
    new ListHeader("Kategoria", 0),
    new ListHeader("Wartość", 0),
    new ListHeader("Więcej", 0)
  ]
  
  constructor() { }

  sortItems(header: ListHeader, items: Operation[]) {
    this.changeArrowDirection(header);

    return this.sortByHeader(header, items);
  }

  private changeArrowDirection(header: ListHeader) {
    if (header.arrowDirection != 0) {
      header.arrowDirection *= -1;
    }
    else {
      this.listHeadersShort.forEach(h => h.arrowDirection = 0);
      header.arrowDirection = -1;
    }    
  }

  private sortByHeader(header: ListHeader, items: Operation[], shouldRevert: boolean = true) {
    switch(header.name) {
      case this.listHeaders[0].name:
        items = items.sort((a,b) => new Date(b.date) > new Date(a.date) ? 1 : -1);
        break;
      case this.listHeaders[1].name:
        items = items.sort((a,b) => new Date(b.date) > new Date(a.date) ? 1 : -1);
        break;
      case this.listHeaders[2].name:
        items = items.sort((a,b) => a.category.localeCompare(b.category));
        break;
      default:
        items = items.sort((a,b) => b.value - a.value);
        break;
    }

    if (shouldRevert && header.arrowDirection == 1) {
      items = items.reverse();
    }

    return items;
  }

  sortByDate(items: Operation[]) {
    return this.sortByHeader(this.listHeadersShort[1], items, false);
  }
}
