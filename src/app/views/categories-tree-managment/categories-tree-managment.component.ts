import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material';
import { CategoriesApiService } from 'app/core/services/api/categories-api.service';

import { CategoriesService } from '../../shared/components/categories-tree/categories.service';
import { Category } from '../../shared/components/categories-tree/models/category';
import { CategoryFlatNode, CategoryNode } from '../../shared/components/categories-tree/models/category-node';

@Component({
  selector: 'dr-categories-tree-managment',
  templateUrl: './categories-tree-managment.component.html',
  styleUrls: ['./categories-tree-managment.component.scss'],
})
export class CategoriesTreeManagmentComponent implements OnInit {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<CategoryFlatNode, CategoryNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<CategoryNode, CategoryFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: CategoryFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<CategoryFlatNode>;

  treeFlattener: MatTreeFlattener<CategoryNode, CategoryFlatNode>;

  dataSource: MatTreeFlatDataSource<CategoryNode, CategoryFlatNode>;

  isCreated: boolean = false;

  @ViewChild('newCategoryName', { static: false }) newCategoryName: ElementRef;

  constructor(private categoriesService: CategoriesService, private api: CategoriesApiService) {}

  public get activeTree(): CategoryNode[] {
    return this.categoriesService.activeTree;
  }

  public get categories(): Category[] {
    return this.categoriesService.categories;
  }

  public set activeTree(value: CategoryNode[]) {
    this.categoriesService.activeTree = value;
  }

  public set treeNode(value: CategoryNode) {
    // this.service.activeTree.
  }

  ngOnInit() {
    console.log(this.dataSource);
  }

  getLevel = (node: CategoryFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => node.expandable;

  getChildren = (node: CategoryNode): CategoryNode[] => node.children;

  hasChild = (_: number, _nodeData: CategoryFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) => _nodeData.title === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: CategoryNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.title === node.title ? existingNode : new CategoryFlatNode();
    flatNode.title = node.title;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /* Get the parent node of a node */
  getParentNode(node: CategoryFlatNode): CategoryFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  createCategory() {
    // const newTree: CategoryNode = new CategoryNode();
    // newTree.title = this.newCategoryName.nativeElement.value as string;
    // this.api.createTree([]);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: CategoryFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    // this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: CategoryFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    // this._database.updateItem(nestedNode!, itemValue);
  }
}
