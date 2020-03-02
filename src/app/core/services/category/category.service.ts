import { Injectable } from '@angular/core';
import { MatTreeFlattener } from '@angular/material/tree';
import { CategoryTreeBase } from 'app/shared/components/categories-tree/category-base';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  CategoryFlatNode,
  CategoryNode,
  CategoryTree,
} from '../../../shared/components/categories-tree/models/category-node';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends CategoryTreeBase {
  private _selectedCategory: BehaviorSubject<
    CategoryNode
  > = new BehaviorSubject({ id: '', title: 'NONE' });
  private _tree: BehaviorSubject<CategoryNode[]> = new BehaviorSubject([]);
  private _treeList: BehaviorSubject<CategoryTree[]> = new BehaviorSubject([]);

  get flatTree(): CategoryFlatNode[] {
    return this.treeFlattener.flattenNodes(this.activeTree);
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
  get activeTree$(): Observable<CategoryNode[]> {
    return this._tree.asObservable();
  }
  set activeTree(value: CategoryNode[]) {
    this._tree.next(value);
  }

  get selectedNode(): CategoryNode {
    return this._selectedCategory.value;
  }
  get selectedNode$(): Observable<CategoryNode> {
    return this._selectedCategory.asObservable();
  }
  set selectedNode(value: CategoryNode) {
    this._selectedCategory.next(value);
  }

  constructor() {
    super();
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
  }
}
