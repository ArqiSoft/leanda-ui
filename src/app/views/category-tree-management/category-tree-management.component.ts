import { FlatTreeControl } from '@angular/cdk/tree';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { CategoryService } from 'app/core/services/category/category.service';

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
    private service: CategoryService,
    private serviceManagment: CategoryTreeManagmentService,
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
    this.serviceManagment.initialize();
    this.serviceManagment.dataChange.subscribe((data: CategoryNode[]) => {
      this.dataSource.data = data;
      this.treeList = this.service.treeList;
      if (this.service.treeList.length > 0) {
        this.serviceManagment
          .treeInfo(this.treeList[0].createdBy, this.treeList[0].updatedBy)
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
    this.serviceManagment.createTree([node]);
  }

  /** Insert new node. */
  addNewNode(node: CategoryFlatNode): void {
    const parentNode = this.flatNodeMap.get(node);
    this.serviceManagment.insertItem(parentNode, '');
    this.treeControl.expand(node);
  }

  /** Insert new main node. */
  addNewMainNode(node: CategoryFlatNode): void {
    this.serviceManagment.insertMainItem();
    this.treeControl.expand(node);
  }

  /** Remove node from database */
  removeNode(node: CategoryFlatNode): void {
    const parentFlatNode = this.getParentNode(node);
    const parentNode = this.flatNodeMap.get(parentFlatNode);
    const nestedNode = this.flatNodeMap.get(node);

    if (!parentNode) {
      this.serviceManagment.removeNode(nestedNode);
    } else {
      this.serviceManagment.removeNestedNode(parentNode, nestedNode);
      if (!parentNode.children || parentNode.children.length === 0) {
        parentFlatNode.isEditEnabled = false;
      }
    }
  }

  /** Save the node to database */
  saveNode(node: CategoryFlatNode, title: string): void {
    const nestedNode = this.flatNodeMap.get(node);
    this.serviceManagment.updateItem(nestedNode, title);
  }

  /** Updates entire tree*/
  updateTree(): void {
    this.serviceManagment.updateTree();
  }

  /** Remove entire tree*/
  removeTree() {
    this.serviceManagment.deleteTree(
      this.service.treeList[0].id,
      this.service.treeList[0].version,
    );
  }

  goBack(): void {
    this.location.back();
  }
}
