import { Injectable } from '@angular/core';
import { MatTreeFlattener } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  CategoryFlatNode,
  CategoryNode,
  CategoryTree,
} from '../../../shared/components/categories-tree/models/category-node';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _selectedCategory: BehaviorSubject<
    CategoryNode
  > = new BehaviorSubject({ id: '', title: 'NONE' });
  private _tree: BehaviorSubject<CategoryNode[]> = new BehaviorSubject([]);
  private _treeList: BehaviorSubject<CategoryTree[]> = new BehaviorSubject([]);
  private _flatTree: BehaviorSubject<CategoryFlatNode> = new BehaviorSubject(
    null,
  );

  get flatTree(): CategoryFlatNode {
    return this._flatTree.value;
  }
  set flatTree(value: CategoryFlatNode) {
    this._flatTree.next(value);
  }

  get treeList(): CategoryTree[] {
    return this._treeList.value;
  }
  set treeList(value: CategoryTree[]) {
    this._treeList.next(value);
  }

  get activeTree(): CategoryNode[] {
    return this._tree.value;
  }
  get activeTreeAsync(): Observable<CategoryNode[]> {
    return this._tree.asObservable();
  }
  set activeTree(value: CategoryNode[]) {
    this._tree.next(value);
  }

  get selectedNode(): CategoryNode {
    return this._selectedCategory.value;
  }
  get selectedNodeAsync(): Observable<CategoryNode> {
    return this._selectedCategory.asObservable();
  }
  set selectedNode(value: CategoryNode) {
    this._selectedCategory.next(value);
  }
}
