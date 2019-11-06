import { FlatTreeControl } from '@angular/cdk/tree';
import { OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';

import { CategoryTreeInfo } from '../../../views/category-tree-managment/CategoryTreeInfo';

import {
  CategoryFlatNode,
  CategoryNode,
  CategoryTree,
} from './models/category-node';

export class CategoryTreeBaseComponent implements OnInit {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<CategoryFlatNode, CategoryNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<CategoryNode, CategoryFlatNode>();

  treeControl: FlatTreeControl<CategoryFlatNode>;

  treeFlattener: MatTreeFlattener<CategoryNode, CategoryFlatNode>;

  dataSource: MatTreeFlatDataSource<CategoryNode, CategoryFlatNode>;

  categories: CategoryTree[];

  treeInfo: CategoryTreeInfo;

  ngOnInit() {}

  hasData = () => !!this.dataSource.data;

  isTreeEmpty = () => this.dataSource.data.length === 0;

  getLevel = (node: CategoryFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => node.isExpandable;

  getChildren = (node: CategoryNode): CategoryNode[] => node.children;

  hasChild = (_: number, _nodeData: CategoryFlatNode) => _nodeData.isExpandable;

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) =>
    _nodeData.title === ''

  hasCategories = () => this.categories.length !== null;

  treeHasOneMainNode = () => this.dataSource.data.length === 1;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: CategoryNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.title === node.title
        ? existingNode
        : new CategoryFlatNode();

    flatNode.id = node.id;
    flatNode.title = node.title;
    flatNode.level = level;
    flatNode.isExpandable = !!node.children;
    flatNode.isEditEnabled = false;
    flatNode.isButtonsVisible = false;

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  }

  /* Return the parent node of a node if it has one */
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
}
