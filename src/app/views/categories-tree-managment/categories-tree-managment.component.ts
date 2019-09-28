import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { Category } from 'app/shared/components/categories-tree/models/category';

import { CategoryFlatNode, CategoryNode } from '../../shared/components/categories-tree/models/category-node';

import { CategoriesTreeManagmentService } from './categories-tree-managment.service';

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

  categories: Category[] = [];

  constructor(private service: CategoriesTreeManagmentService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.service.dataChange.subscribe((data: CategoryNode[]) => {
      this.dataSource.data = data;
      this.categories = this.service.categories;
    });
  }

  ngOnInit() {}

  hasData = () => this.dataSource.data !== null && this.dataSource.data.length > 0;

  getLevel = (node: CategoryFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => node.expandable;

  getChildren = (node: CategoryNode): CategoryNode[] => node.children;

  hasChild = (_: number, _nodeData: CategoryFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) => _nodeData.title === '';

  moreThanOneCategory = () => this.categories.length > 0;

  hasOnlyItem = () => this.dataSource.data.length === 1;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: CategoryNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.title === node.title ? existingNode : new CategoryFlatNode();
    flatNode.title = node.title;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.editable = false;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Creates new Category if non exists */
  createCategory(title: string, children: boolean) {
    /**
     * As we are working with only one category atm
     * when we remove all items from category we have to
     * update current category tree with empty values
     */
    const node = new CategoryNode();

    if (!this.hasData()) {
      if (children) {
        node.children = [];
      }
      node.title = title;

      this.service.createCategory([node]);
    }
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

  /** Select the category so we can insert the new item. */
  addNewNode(node: CategoryFlatNode): void {
    const parentNode = this.flatNodeMap.get(node);
    this.service.insertItem(parentNode, '');
    this.treeControl.expand(node);
  }

  removeNode(node: CategoryFlatNode): void {
    const parentNode = this.flatNodeMap.get(this.getParentNode(node));
    const nestedNode = this.flatNodeMap.get(node);

    if (!parentNode) {
      this.service.removeNode(nestedNode);
    } else {
      this.service.removeNestedNode(parentNode, nestedNode);
    }
  }

  /** Save the node to database */
  saveNode(node: CategoryFlatNode, itemValue: string, children: boolean): void {
    const nestedNode = this.flatNodeMap.get(node);
    this.service.updateItem(nestedNode, itemValue, children);
  }
}
