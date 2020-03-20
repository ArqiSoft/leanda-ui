import { FlatTreeControl } from '@angular/cdk/tree';
import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTreeFlatDataSource } from '@angular/material/tree';

import {
  CategoryFlatNode,
  CategoryNode,
  CategoryTree
} from "../../shared/components/categories-tree/models/category-node";

import { CategoryTreeManagmentService } from "./category-tree-management.service";
import { switchMap } from "rxjs/operators";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { CategoryStorageService } from "../../core/services/category/category-storage.service";
import { CategoryTreeInfo } from "./CategoryTreeInfo";

enum ContentReadyStatus {
  processing,
  ready,
  error,
  idle,
  empty,
  new
}

@Component({
  selector: "dr-category-tree-management",
  templateUrl: "./category-tree-management.component.html",
  styleUrls: ["./category-tree-management.component.scss"]
})
export class CategoryTreeManagmentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private status$ = new BehaviorSubject<ContentReadyStatus>(
    ContentReadyStatus.idle
  );

  dataSource: MatTreeFlatDataSource<CategoryNode, CategoryFlatNode>;
  treeControl: FlatTreeControl<CategoryFlatNode>;

  status = ContentReadyStatus;

  get contentStatus(): Observable<ContentReadyStatus> {
    return this.status$.asObservable();
  }

  constructor(
    private service: CategoryTreeManagmentService,
    private storageService: CategoryStorageService,
    private location: Location
  ) {}

  ngOnInit() {
    this.status$.next(ContentReadyStatus.processing);

    this.dataSource = this.storageService.dataSource;
    this.treeControl = this.storageService.treeControl;

    this.service.initialize().subscribe(
      (tree: CategoryTree) => {
        if (tree === null) {
          this.status$.next(ContentReadyStatus.new);
        } else {
          // NOTE: updates DataSource data
          if (
            this.storageService.hasData() &&
            this.storageService.hasCategories()
          ) {
            this.service.refreshTreeData();
            this.status$.next(ContentReadyStatus.ready);
          } else {
            this.status$.next(ContentReadyStatus.empty);
          }
        }
      },
      () => this.status$.next(ContentReadyStatus.error)
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  treeInfo = (): CategoryTreeInfo => this.storageService.treeInfo;
  isTreeEmpty = () => {
    const title =
      this.dataSource.data &&
      this.dataSource.data[0] &&
      this.dataSource.data[0].title &&
      this.dataSource.data[0].title.length > 0
        ? this.dataSource.data[0].title
        : "";
    return (
      this.dataSource.data &&
      this.dataSource.data.length > 0 &&
      title &&
      title !== "" &&
      title !== null
    );
  };
  getLevel = (node: CategoryFlatNode) => this.storageService.getLevel(node);
  hasChild = this.storageService.hasChild;
  hasNoContent = this.storageService.hasNoContent;
  treeHasOneMainNode = this.storageService.treeHasOneMainNode;

  createTree = (title: string) => {
    this.status$.next(ContentReadyStatus.processing);
    this.service
      .createTree([Object.assign(new CategoryNode(), title)])
      .pipe(switchMap((id: string) => this.service.getTree(id)))
      .subscribe((tree: CategoryTree) => {
        this.dataSource.data = [];
        this.dataSource.data = tree.nodes ? tree.nodes : [];
        this.status$.next(ContentReadyStatus.ready);
      });
  };

  /** Insert new node. */
  addNewNode(node: CategoryFlatNode): void {
    const parentNode = this.storageService.flatNodeMap.get(node);
    this.service.insertItem(parentNode, "");
    this.treeControl.expand(node);
  }

  /** Insert new main node. */
  addNewMainNode(node: CategoryFlatNode): void {
    this.service.insertMainItem();
    this.treeControl.expand(node);
  }

  /** Remove node from database */
  removeNode(node: CategoryFlatNode): void {
    const parentFlatNode = this.storageService.getParentNode(node);
    const parentNode = this.storageService.flatNodeMap.get(parentFlatNode);
    const nestedNode = this.storageService.flatNodeMap.get(node);

    if (node.id !== undefined) {
      if (!parentNode) {
        this.service.removeNode(nestedNode);
      } else {
        this.service.removeNestedNode(parentNode, nestedNode);
        if (!parentNode.children || parentNode.children.length === 0) {
          parentFlatNode.isEditEnabled = false;
        }
      }
    }
    this.service.refreshTreeData();
  }

  /** Save the node to database */
  saveNode(node: CategoryFlatNode, title: string): void {
    const categoryNode = this.storageService.flatNodeMap.get(node);
    categoryNode.title = title;
    this.service.updateItem(categoryNode);
    this.treeControl.expand(node);
  }

  goBack(): void {
    this.location.back();
  }
}
