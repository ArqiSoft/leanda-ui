import { Injectable } from '@angular/core';
import { CategoriesApiService } from 'app/core/services/api/categories-api.service';
import { UsersApiService } from 'app/core/services/api/users-api.service';
import { Category } from 'app/shared/components/categories-tree/models/category';
import { CategoryNode } from 'app/shared/components/categories-tree/models/category-node';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { CategoryTreeInfo } from './CategoryTreeInfo';

@Injectable({
  providedIn: 'root',
})
export class CategoriesTreeManagmentService {
  dataChange = new BehaviorSubject<CategoryNode[]>([]);

  private _cateogories = new BehaviorSubject<Category[]>([]);

  get data(): CategoryNode[] {
    return this.dataChange.value;
  }

  get categories(): Category[] {
    return this._cateogories.value;
  }

  constructor(private api: CategoriesApiService, private userApi: UsersApiService) {
    this.initialize();
  }

  /**
   * Initializing categories
   */
  initialize() {
    // retriving list of avalible categories
    this.getCategories().subscribe((categories: Category[]) => {
      // notyfing `categories` subject
      this._cateogories.next(categories);
      // if categories list is not empty - retrieving first category
      // TBD: change when `Leanda` will support multiple categories functionality
      if (categories.length > 0) {
        this.getCategoryTree(this.categories[0].id);
      }
    });
  }

  /**
   * Add an item to to-do list
   * @param parent Parent CategoryNode
   * @param name Title of the category to be pushed as child
   * @param hasChildren If True - adds 'children' property
   */
  insertItem(parent: CategoryNode, name: string) {
    if (parent.children) {
      parent.children.push({ title: name } as CategoryNode);
      this.dataChange.next(this.data);
    } else {
      parent.children = [];
      parent.children.push({ title: name, children: [] } as CategoryNode);
      this.dataChange.next(this.data);
    }
  }

  insertMainItem() {
    this.data.push({ title: '' } as CategoryNode);
    this.dataChange.next(this.data);
  }

  /**
   * Add an item to CategoryNode list
   * @param node Current CategoryNode
   * @param title Title of the category to be pushed as child
   */
  updateItem(node: CategoryNode, title: string) {
    // update node in databse separatly from tree if it has assigned ID
    if (Object.keys(node).includes('id')) {
      this.updateTreeNode(node);
    }

    // if there is no ID assigned to a node, store in memory until user update entire tree
    node.title = title;
    this.dataChange.next(this.data);
  }

  /**
   * This method removes the first by deepnest elements of CategoryNode[]
   * @param deletedNode the node that has to be deleted
   */
  removeNode(deletedNode: CategoryNode) {
    this.api
      .deleteTreeNode(this.categories[0].id, deletedNode, this.categories[0].version)
      .subscribe(() => this.dataChange.next(this.data.filter(node => node !== deletedNode)));
  }

  /**
   * This method removes selected node by deep searching into elements of CategoryNode[]
   * @param deletedNode the node that has to be deleted
   */
  removeNestedNode(parent: CategoryNode, deletedNode: CategoryNode) {
    if (parent.children) {
      if (deletedNode.title === '') {
        parent.children = parent.children.filter(childNode => childNode !== parent.children.find(node => node === deletedNode));
      } else {
        parent.children = parent.children.filter(node => node !== deletedNode);
      }

      this.dataChange.next(this.data);
    }
  }

  /**
   * Updated entire tree
   */
  updateTree() {
    this.api.updateTree(this.categories[0].id, this.data);
    // TODO: update the data about current tree from BE
  }

  /**
   *
   * @param id category id
   * @param node category tree node id
   * @param nodes category tree new nodes
   */
  updateTreeNode(node: CategoryNode) {
    this.api.updateTreeNode(this.categories[0].id, node);
  }

  /**
   * Creates new Category
   * @param tree is a new CategoryNode array
   */
  createCategory(tree: CategoryNode[]): void {
    this.api.createTree(tree).subscribe(id => this.getCategoryTree(id));
  }

  treeInfo(createdBy: string, updatedBy: string): Observable<CategoryTreeInfo> {
    return combineLatest([this.userApi.getUserInfo(createdBy), this.userApi.getUserInfo(updatedBy)]).pipe(
      map(([_createdBy, _updatedBy]) => {
        const treeInfo: CategoryTreeInfo = {
          createdBy: `${_createdBy.firstName} ${_createdBy.lastName}`,
          updatedBy: `${_updatedBy.firstName} ${_updatedBy.lastName}`,
          createdDateTime: this.categories[0].createdDateTime,
          updatedDateTime: this.categories[0].updatedDateTime,
        };

        return treeInfo;
      }),
    );
  }

  private getCategoryTree(id: string): void {
    this.api.getTree(id).subscribe(tree => this.dataChange.next(tree.nodes));
  }

  private getCategories(): Observable<Category[]> {
    return this.api.getCategories();
  }
}
