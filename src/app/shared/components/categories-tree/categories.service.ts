import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Category } from './models/category';
import { CategoryNode } from './models/category-node';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _selectedCategory: BehaviorSubject<CategoryNode> = new BehaviorSubject({ id: '', title: 'NONE' });
  private _activeTree: BehaviorSubject<CategoryNode[]> = new BehaviorSubject([]);
  private _categories: BehaviorSubject<Category[]> = new BehaviorSubject([]);

  public get categories(): Category[] {
    return this._categories.value;
  }
  public set categories(value: Category[]) {
    this._categories.next(value);
  }

  public get activeTree(): CategoryNode[] {
    return this._activeTree.value;
  }
  public get activeTreeAsync(): Observable<CategoryNode[]> {
    return this._activeTree.asObservable();
  }
  public set activeTree(value: CategoryNode[]) {
    this._activeTree.next(value);
  }

  public get selectedCategory(): CategoryNode {
    return this._selectedCategory.value;
  }
  public get selectedCategoryAsync(): Observable<CategoryNode> {
    return this._selectedCategory.asObservable();
  }
  public set selectedCategory(value: CategoryNode) {
    this._selectedCategory.next(value);
  }
}
