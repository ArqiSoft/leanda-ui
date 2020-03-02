import { FlatTreeControl } from '@angular/cdk/tree';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { CategoryTreeBase } from '../../shared/components/categories-tree/category-base';
import {
  CategoryFlatNode,
  CategoryNode,
} from '../../shared/components/categories-tree/models/category-node';

import { CategoryTreeManagmentService } from './category-tree-management.service';

@Component({
  selector: 'dr-category-tree-management',
  templateUrl: './category-tree-management.component.html',
  styleUrls: ['./category-tree-management.component.scss'],
})
export class CategoryTreeManagmentComponent extends CategoryTreeBase
  implements OnInit {
  constructor(
    private service: CategoryTreeManagmentService,
    private location: Location,
  ) {
    super();
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(
      this.getLevel,
      this.isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    );
  }

  ngOnInit() {
    this.service.dataChange.subscribe((data: CategoryNode[]) => {
      this.dataSource.data = data;
      this.categories = this.service.categoryList;
      if (this.service.categoryList.length > 0) {
        this.service
          .treeInfo(this.categories[0].createdBy, this.categories[0].updatedBy)
          .subscribe(res => (this.treeInfo = res));
      }
    });
  }

  /** Method to create new Tree with first node if non exists */
  createTree(title: string) {
    /**
     * As we are working with only one tree atm
     * when we remove all items from tree we have to
     * update current tree with empty values
     */
    const node = new CategoryNode();

    node.title = title;
    this.service.createTree([node]);
  }

  /** Insert new node. */
  addNewNode(node: CategoryFlatNode): void {
    const parentNode = this.flatNodeMap.get(node);
    this.service.insertItem(parentNode, '');
    this.treeControl.expand(node);
  }

  /** Insert new main node. */
  addNewMainNode(node: CategoryFlatNode): void {
    this.service.insertMainItem();
    this.treeControl.expand(node);
  }

  /** Remove node from database */
  removeNode(node: CategoryFlatNode): void {
    const parentFlatNode = this.getParentNode(node);
    const parentNode = this.flatNodeMap.get(parentFlatNode);
    const nestedNode = this.flatNodeMap.get(node);

    if (!parentNode) {
      this.service.removeNode(nestedNode);
    } else {
      this.service.removeNestedNode(parentNode, nestedNode);
      if (!parentNode.children || parentNode.children.length === 0) {
        parentFlatNode.isEditEnabled = false;
      }
    }
  }

  /** Save the node to database */
  saveNode(node: CategoryFlatNode, title: string): void {
    const nestedNode = this.flatNodeMap.get(node);
    this.service.updateItem(nestedNode, title);
  }

  /** Updates entire tree*/
  updateTree(): void {
    this.service.updateTree();
  }

  /** Remove entire tree*/
  removeTree() {
    this.service.deleteTree(
      this.service.categoryList[0].id,
      this.service.categoryList[0].version,
    );
  }

  goBack(): void {
    this.location.back();
  }
}
