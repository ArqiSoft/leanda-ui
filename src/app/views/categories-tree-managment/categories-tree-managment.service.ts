import { Injectable } from '@angular/core';
import { CategoriesApiService } from 'app/core/services/api/categories-api.service';
import { UsersApiService } from 'app/core/services/api/users-api.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Category } from 'app/shared/components/categories-tree/models/category';
import { CategoryNode } from 'app/shared/components/categories-tree/models/category-node';
import { NotificationType } from 'app/shared/components/notifications/events.model';
import {
  NotificationItem,
  NotificationMessage,
} from 'app/shared/components/notifications/notifications.model';
import { BehaviorSubject, Observable, combineLatest, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CategoryTreeInfo } from './CategoryTreeInfo';

type Tree = CategoryNode[];

@Injectable({
  providedIn: 'root',
})
export class CategoriesTreeManagmentService {
  /**
   * TODO: implement multiple categories managment
   * -> replace all use of all `category[0]` with appropriate logic for managing multiple categories
   */

  dataChange = new BehaviorSubject<CategoryNode[]>([]);

  private _category = new BehaviorSubject<Category>(null);
  private _categoryList = new BehaviorSubject<Category[]>([]);

  get tree(): Tree {
    return this.dataChange.value;
  }

  get categoryList(): Category[] {
    return this._categoryList.value;
  }

  get category(): Category {
    return this._category.value;
  }

  set category(category: Category) {
    this._category.next(category);
  }

  constructor(
    private api: CategoriesApiService,
    private userApi: UsersApiService,
    private notification: NotificationsService,
  ) {
    this.initialize();
  }

  /**
   * Initializing categories
   */
  initialize() {
    // retriving list of avalible categories
    this.getCategories().subscribe((categories: Category[]) => {
      // notyfing `categories` subject
      this._categoryList.next(categories);
      // if categories list is not empty - retrieving first category as default
      // TBD: change when `Leanda` will support multiple categories functionality
      if (categories.length > 0) {
        this.getCategoryTree(this.categoryList[0].id);
      } else if (categories.length === 0) {
        this.dataChange.next([]);
      } else {
        this.dataChange.next(null);
      }
    });
  }

  /**
   * Add a new node to the CategoryTree Node
   * @param parent Parent CategoryNode
   * @param name Title of the category to be pushed as child
   */
  insertItem(parent: CategoryNode, name: string) {
    if (parent.children) {
      parent.children.push({ title: name } as CategoryNode);
      this.dataChange.next(this.tree);
    } else {
      parent.children = [];
      parent.children.push({ title: name, children: [] } as CategoryNode);
      this.dataChange.next(this.tree);
    }
  }

  /**
   * Add a new node at level 0 of the CategoryTree
   * @param parent Parent CategoryNode
   * @param name Title of the category to be pushed as child
   */
  insertMainItem() {
    this.tree.push({ title: '' } as CategoryNode);
    this.dataChange.next(this.tree);
  }

  /**
   * Add an item to CategoryNode list
   * @param node Current CategoryNode
   * @param title Title of the category to be pushed as child
   */
  updateItem(node: CategoryNode, title: string) {
    // update node in databse separatly from tree if it has assigned ID
    if (Object.keys(node).includes('id')) {
      this.updateTreeNode(node).subscribe(() =>
        this.notification.showToastNotification(
          new NotificationItem(
            null,
            NotificationMessage.CreateCommonMessage(
              NotificationType.Info,
              'Node Update',
              'Node has been succefully updated',
            ),
          ),
          false,
        ),
      );
    }

    // if there is no ID assigned to a node, store in memory until user update entire tree
    node.title = title;
    this.dataChange.next(this.tree);
    // update entire tree in order to get ids for cached on FE nodes and their children
    this.updateTree();
  }

  deleteTree(id: string, version: number) {
    return this.api.deleteTree(id, version).subscribe(() => this.initialize());
  }

  /**
   * This method removes the first by deepnest elements of CategoryNode[]
   * @param deletedNode the node that has to be deleted
   */
  removeNode(deletedNode: CategoryNode) {
    this.api
      .deleteTreeNode(
        this.categoryList[0].id,
        deletedNode,
        this.categoryList[0].version,
      )
      .subscribe(() =>
        this.dataChange.next(this.tree.filter(node => node !== deletedNode)),
      );
  }

  /**
   * This method removes selected node by deep searching into elements of CategoryNode[]
   * @param deletedNode the node that has to be deleted
   */
  removeNestedNode(parent: CategoryNode, deletedNode: CategoryNode) {
    if (parent.children) {
      this.api
        .deleteTreeNode(
          this.categoryList[0].id,
          deletedNode,
          this.categoryList[0].version,
        )
        .subscribe(() => {
          if (deletedNode.title === '') {
            parent.children = parent.children.filter(
              childNode =>
                childNode !==
                parent.children.find(node => node === deletedNode),
            );
          } else {
            parent.children = parent.children.filter(
              node => node !== deletedNode,
            );
          }
          this.dataChange.next(this.tree);
        });
    }
  }

  /**
   * Updated entire tree
   */
  updateTree(): void {
    // this.api.updateTree(this.currentCategory, this.tree);
    this.api.updateTree(this.categoryList[0].id, this.tree).subscribe();
  }

  /**
   *
   * @param id category id
   * @param node category tree node id
   * @param nodes category tree new nodes
   */
  updateTreeNode(node: CategoryNode): Observable<string> {
    return this.api.updateTreeNode(this.categoryList[0].id, node);
  }

  /**
   * Creates new Category
   * @param tree is a new CategoryNode array
   */
  createTree(tree: CategoryNode[]): void {
    this.api.createTree(tree).subscribe();
  }

  treeInfo(createdBy: string, updatedBy: string): Observable<CategoryTreeInfo> {
    return combineLatest([
      this.userApi.getUserInfo(createdBy),
      this.userApi.getUserInfo(updatedBy),
    ]).pipe(
      map(([_createdBy, _updatedBy]) => {
        const treeInfo: CategoryTreeInfo = {
          createdBy: `${_createdBy.firstName} ${_createdBy.lastName}`,
          updatedBy: `${_updatedBy.firstName} ${_updatedBy.lastName}`,
          createdDateTime: this.categoryList[0].createdDateTime,
          updatedDateTime: this.categoryList[0].updatedDateTime,
        };

        return treeInfo;
      }),
      catchError((error: any) => {
        return throwError(error);
      }),
    );
  }

  private getCategoryTree(id: string): void {
    this.api
      .getTree(id)
      .subscribe(tree =>
        this.dataChange.next(tree.nodes !== null ? tree.nodes : []),
      );
  }

  private getCategories(): Observable<Category[]> {
    return this.api.getCategories();
  }
}
