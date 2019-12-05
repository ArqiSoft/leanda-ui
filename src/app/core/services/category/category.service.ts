import { Injectable } from '@angular/core';
import { MatTreeFlattener } from '@angular/material';
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
  private _selectedNode: BehaviorSubject<CategoryNode> = new BehaviorSubject({ id: '', title: 'NONE' });
  private _tree: BehaviorSubject<CategoryTree> = new BehaviorSubject(null);
  private _treeList: BehaviorSubject<CategoryTree[]> = new BehaviorSubject([]);

  get flatTree(): CategoryFlatNode[] {
    return this.treeFlattener.flattenNodes(this.tree.nodes);
  }

  get treeList(): CategoryTree[] {
    return this._treeList.value;
  }
  set treeList(value: CategoryTree[]) {
    this._treeList.next(value);
  }

  get tree(): CategoryTree {
    return this._tree.value;
  }
  get tree$(): Observable<CategoryTree> {
    return this._tree.asObservable();
  }
  set tree(value: CategoryTree) {
    this._tree.next(value);
  }

  get selectedNode(): CategoryNode {
    return this._selectedNode.value;
  }
  get selectedNode$(): Observable<CategoryNode> {
    return this._selectedNode.asObservable();
  }
  set selectedNode(value: CategoryNode) {
    this._selectedNode.next(value);
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
