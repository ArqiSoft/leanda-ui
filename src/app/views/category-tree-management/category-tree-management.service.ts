import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, throwError } from 'rxjs';
import { catchError, delay, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { CategoryTreeApiService } from '../../core/services/api/category-tree-api.service';
import { UsersApiService } from '../../core/services/api/users-api.service';
import { CategoryService } from '../../core/services/category/category.service';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import {
  CategoryNode,
  CategoryTree,
} from '../../shared/components/categories-tree/models/category-node';
import { NotificationType } from '../../shared/components/notifications/events.model';
import {
  NotificationItem,
  NotificationMessage,
} from '../../shared/components/notifications/notifications.model';

import { CategoryTreeInfo } from './CategoryTreeInfo';

@Injectable({
  providedIn: 'root',
})
export class CategoryTreeManagmentService {
  /**
   * TODO: implement multiple categories managment
   * -> replace all use of all `category[0]` with appropriate logic for managing multiple categories
   */

  dataChange = new BehaviorSubject<CategoryNode[]>([]);

  constructor(
    private api: CategoryTreeApiService,
    private service: CategoryService,
    private userApi: UsersApiService,
    private notification: NotificationsService,
  ) { }

  /**
   * Initializing categories
   */
  initialize() {
    // retriving list of avalible categories
    this.getTreeList().subscribe((categories: CategoryTree[]) => {
      // notyfing `categories` subject
      this.service.treeList = categories;
      // if categories list is not empty - retrieving first category as default
      // TBD: change when `Leanda` will support multiple categories functionality
      if (categories !== null && categories.length !== 0) {
        this.getCategoryTree(this.service.treeList[0].id);
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
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push({ title: name } as CategoryNode);
    this.dataChange.next(this.service.tree.nodes);
  }

  /**
   * Add a new node at level 0 of the CategoryTree
   * @param parent Parent CategoryNode
   * @param name Title of the category to be pushed as child
   */
  insertMainItem() {
    const tree = this.service.tree;
    tree.nodes.push({ title: '' } as CategoryNode);
    this.service.tree = tree;
    this.dataChange.next(this.service.tree.nodes);
  }

  /**
   * Add an item to CategoryNode list
   * @param node Current CategoryNode
   * @param title Title of the category to be pushed as child
   */
  updateItem(node: CategoryNode, title: string) {
    // update node in databse separatly from tree if it has assigned ID
    if (Object.keys(node).includes('id')) {
      this.updateTreeNode(node).subscribe(
        () =>
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
        error => throwError(`Couldn't update tree with category - ${title}`),
      );
    }

    // if there is no ID assigned to a node, store in memory until user update entire tree
    node.title = title;
    this.dataChange.next(this.service.tree.nodes);
    // update entire tree in order to get ids for cached on FE nodes and their children
    this.updateTree().subscribe(res =>
      this.getCategoryTree(this.service.tree.id),
    );
  }

  deleteTree(id: string, version: number) {
    return this.api.deleteTree(id, version).subscribe(() => this.initialize());
  }

  /**
   * Removes the first by deepnest elements of CategoryNode[]
   * @param deletedNode the node that has to be deleted
   */
  removeNode(deletedNode: CategoryNode) {
    this.api
      .deleteTreeNode(
        this.service.tree.id,
        deletedNode,
        this.service.tree.version,
      )
      .subscribe(() => {
        this.getCategoryTree(this.service.tree.id);
        this.dataChange.next(this.service.tree.nodes.filter(node => node !== deletedNode));
      });
  }

  /**
   * Removes selected node by deep searching into elements of CategoryNode[]
   * @param deletedNode the node that has to be deleted
   */
  removeNestedNode(parent: CategoryNode, deletedNode: CategoryNode) {
    if (parent.children) {
      this.api
        .deleteTreeNode(
          this.service.tree.id,
          deletedNode,
          this.service.tree.version,
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
          this.getCategoryTree(this.service.tree.id);
          this.dataChange.next(this.service.tree.nodes);
        });
    } else {
      parent.children = parent.children
        .filter(node => node.title === '')
        .splice(parent.children.length, 1);
    }
  }

  /**
   * Updated entire tree
   */
  updateTree(): Observable<boolean> {
    // this.api.updateTree(this.currentCategory, this.service.tree.nodes);
    return this.api.updateTree(
      this.service.tree.id,
      this.service.tree.nodes,
      this.service.tree.version,
    );
  }

  /**
   * Creates new Category
   * @param tree is a new CategoryNode array
   */
  createTree(tree: CategoryNode[]): void {
    this.api.createTree(tree).subscribe(
      category_id =>
        this.getTreeList()
          .pipe(delay(1000))
          .pipe(tap(() => this.getCategoryTree(category_id)))
          .subscribe(
            categories => this.service.treeList = categories,
            error => throwError(`Couldn't retrieve list of available trees`),
          ),
      error => throwError(`Couldn't create tree`),
    );
  }
  /**
   * Method that retrieves data about current tree
   * @param createdBy User GUID
   * @param updatedBy User GUID
   */
  treeInfo(createdBy: string, updatedBy: string): Observable<CategoryTreeInfo> {
    return combineLatest([
      this.userApi.getUserInfo(createdBy),
      this.userApi.getUserInfo(updatedBy),
    ]).pipe(
      map(([_createdBy, _updatedBy]) => {
        const treeInfo: CategoryTreeInfo = {
          createdBy: `${_createdBy.firstName} ${_createdBy.lastName}`,
          updatedBy: `${_updatedBy.firstName} ${_updatedBy.lastName}`,
          createdDateTime: this.service.tree.createdDateTime,
          updatedDateTime: this.service.tree.updatedDateTime,
        };

        return treeInfo;
      }),
      catchError((error: any) => {
        return throwError(error);
      }),
    );
  }

  /**
   *
   * @param id category id
   * @param node category tree node id
   * @param nodes category tree new nodes
   */
  private updateTreeNode(node: CategoryNode): Observable<string> {
    return this.api.updateTreeNode(this.service.tree.id, node, this.service.tree.version);
  }

  /**
   * Method to retireve `CategoryTree` tree by parameter
   * @param id Tree GUID
   */
  private getCategoryTree(id: string): void {
    this.api
      .getTree(id)
      .pipe(distinctUntilChanged((prev, curr) => prev.version < curr.version))
      .subscribe(
        tree => {
          console.log(tree.version);
          this.service.tree = tree;
          this.updateTreeVersion(tree.version);
          // this.service.tree.nodes = tree.nodes ? tree.nodes : [];
          this.dataChange.next(tree.nodes !== null ? tree.nodes : []);
        },
        error => throwError(`Couldn't retrieve tree with id ${id}`),
      );
  }
  /** Method to retrieve from api list of available trees */
  private getTreeList(): Observable<CategoryTree[]> {
    return this.api.getTreeList();
  }

  /**
   * Updates Category First Tree Version
   */
  private updateTreeVersion(newVersion: number): void {
    if (this.service.treeList.length > 0 && this.service.tree.version !== newVersion) {
      this.service.tree.version = newVersion;
    } else if (this.service.tree.version === newVersion) {
      console.log('Version has not been changed');
    }
  }
}
