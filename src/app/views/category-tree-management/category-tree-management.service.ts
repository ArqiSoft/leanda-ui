import { Injectable } from "@angular/core";
import { Observable, combineLatest, throwError, EMPTY, of } from "rxjs";
import {
  catchError,
  map,
  tap,
  switchMap,
  mergeMap,
  retry,
  debounceTime,
  delay,
  concatAll
} from "rxjs/operators";

import { CategoryTreeApiService } from "../../core/services/api/category-tree-api.service";
import { UsersApiService } from "../../core/services/api/users-api.service";
import { CategoryStorageService } from "../../core/services/category/category-storage.service";
import { NotificationsService } from "../../core/services/notifications/notifications.service";
import {
  CategoryNode,
  CategoryTree
} from "../../shared/components/categories-tree/models/category-node";
import { NotificationType } from "../../shared/components/notifications/events.model";
import {
  NotificationItem,
  NotificationMessage
} from "../../shared/components/notifications/notifications.model";

import { CategoryTreeInfo } from "./CategoryTreeInfo";

@Injectable({
  providedIn: "root"
})
export class CategoryTreeManagmentService {
  /**
   * TODO: implement multiple categories managment
   * -> replace all use of all `category[0]` with appropriate logic for managing multiple categories
   */

  get tree(): CategoryTree {
    return this.service.tree;
  }

  constructor(
    private api: CategoryTreeApiService,
    private service: CategoryStorageService,
    private userApi: UsersApiService,
    private notification: NotificationsService
  ) {}

  /**
   * Initializing categories
   */
  initialize(): Observable<CategoryTree | null> {
    return this.getTreeList().pipe(
      switchMap((treeList: CategoryTree[]) => {
        this.service.treeList = treeList;
        if (treeList !== null && treeList.length !== 0) {
          return this.getTree(treeList[0].id).pipe(
            tap(tree => {
              this.service.tree = tree;
              this.service.dataSource.data = tree.nodes ? tree.nodes : [];
            })
          );
        } else if (treeList.length === 0) {
          return of(null);
        } else {
          return EMPTY;
        }
      })
    );
  }
  insertItem(parent: CategoryNode, name: string) {
    if (parent.children) {
      parent.children.push({ title: name } as CategoryNode);
    } else {
      parent.children = [];
      parent.children.push({ title: name } as CategoryNode);
    }
    this.refreshTreeData();
  }
  insertMainItem() {
    this.service.dataSource.data.push({ title: "" } as CategoryNode);
    this.refreshTreeData();
  }
  updateItem(node: CategoryNode) {
    // update node in databse separatly from tree if it has assigned ID
    if (Object.keys(node).includes("id")) {
      this.updateExistingTreeNode(node).subscribe(
        () => {
          this.notification.showToastNotification(
            new NotificationItem(
              null,
              NotificationMessage.CreateCommonMessage(
                NotificationType.Info,
                "Node Update",
                "Node has been succefully updated"
              )
            ),
            false
          );
        },
        () => throwError(`Couldn't update tree with category - ${node.title}`)
      );
    } else {
      this.updateTree()
        .pipe(
          delay(500),
          switchMap(() => this.getTree(this.tree.id))
        )
        .subscribe(() => this.refreshTreeData());
    }
  }
  removeNode = (deletedNode: CategoryNode) => {
    of(
      this.api.deleteTreeNode(this.tree.id, deletedNode, this.tree.version),
      this.getTree(this.service.tree.id),
      this.getTree(this.tree.id)
    )
      .pipe(concatAll())
      .subscribe(() => this.refreshTreeData());
  };
  removeNestedNode(parent: CategoryNode, deletedNode: CategoryNode): void {
    if (parent.children) {
      this.api
        .deleteTreeNode(this.tree.id, deletedNode, this.tree.version)
        .pipe(switchMap(() => this.getTree(this.tree.id)))
        .subscribe((tree: CategoryTree) => {
          this.service.dataSource.data = [];
          this.service.dataSource.data = tree.nodes;

          if (deletedNode.title === "") {
            parent.children = parent.children.filter(
              childNode =>
                childNode !== parent.children.find(node => node === deletedNode)
            );
          } else {
            parent.children = parent.children.filter(
              node => node !== deletedNode
            );
          }
          this.refreshTreeData();
        });
    } else {
      parent.children = parent.children
        .filter(node => node.title === "")
        .splice(parent.children.length, 1);
      this.getTree(this.tree.id).subscribe(() => this.refreshTreeData());
    }
  }
  updateTree = (): Observable<boolean> =>
    this.api.updateTree(
      this.tree.id,
      this.service.dataSource.data,
      this.tree.version
    );
  updateTreeNode = (node: CategoryNode): Observable<string> =>
    this.api.updateTreeNode(this.tree.id, node);
  updateExistingTreeNode = (node: CategoryNode): Observable<string> =>
    this.api.updateExistingTreeNode(this.tree.id, node);
  createTree = (treeNodes: CategoryNode[]): Observable<string> =>
    this.api.createTree(treeNodes);
  updateTreeInfo(): void {
    combineLatest([
      this.userApi.getUserInfo(this.tree.createdBy),
      this.userApi.getUserInfo(this.tree.updatedBy)
    ]).pipe(
      map(([_createdBy, _updatedBy]) => {
        const treeInfo: CategoryTreeInfo = {
          createdBy: `${_createdBy.firstName} ${_createdBy.lastName}`,
          updatedBy: `${_updatedBy.firstName} ${_updatedBy.lastName}`,
          createdDateTime: this.tree.createdDateTime,
          updatedDateTime: this.tree.updatedDateTime
        };

        this.service.treeInfo = treeInfo;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  getTree = (id: string): Observable<CategoryTree> => this.api.getTree(id);
  getTreeList = (): Observable<CategoryTree[]> => this.api.getTreeList();
  refreshTreeData() {
    const data = this.service.dataSource.data;
    this.service.dataSource.data = [];
    this.service.dataSource.data = data;
  }
}
