import { Component,  OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoryService } from 'app/core/services/categories/categories.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { CategoryNode } from '../categories-tree/models/category-node';

@Component({
  selector: 'dr-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.scss'],
})
export class CategorySelectionComponent implements OnInit {
  categories: CategoryNode[] = [];
  categoryInput = new FormControl();
  filteredCategories: Observable<CategoryNode[]>;

  constructor(private categoriesService: CategoryService) {}
  ngOnInit() {
    this.filteredCategories = this.categoryInput.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: CategoryNode): CategoryNode[] {
    const filterValue = value;

    return this.categoriesService.activeTree.filter(
      category => category.id.indexOf(filterValue.id) === 0,
    );
  }
}
