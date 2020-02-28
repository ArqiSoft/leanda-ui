import { Injectable } from "@angular/core";
import { MatTreeFlattener, MatTreeFlatDataSource } from "@angular/material";
import { CategoryTreeBase } from "app/shared/components/categories-tree/category-base";
import { BehaviorSubject, Observable } from "rxjs";

import {
  CategoryFlatNode,
  CategoryNode,
  CategoryTree
} from "../../../shared/components/categories-tree/models/category-node";
import { FlatTreeControl } from "@angular/cdk/tree";

@Injectable({
  providedIn: "root"
})
export class CategoryStorageService extends CategoryTreeBase {
  private _selectedCategory: BehaviorSubject<
    CategoryNode
  > = new BehaviorSubject({ id: "", title: "NONE" });
  private _tree: BehaviorSubject<CategoryTree> = new BehaviorSubject(null);
  private _treeList: BehaviorSubject<CategoryTree[]> = new BehaviorSubject([]);

  get flatTreeNodes(): CategoryFlatNode[] {
    return this.treeFlattener.flattenNodes(this.dataSource.data);
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
  set tree(tree: CategoryTree) {
    this._tree.next(tree);
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
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }
}
