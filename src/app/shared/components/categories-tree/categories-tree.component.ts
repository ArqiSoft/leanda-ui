import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoriesApiService } from '../../../core/services/api/categories-api.service';

import { CategoriesService } from './categories.service';
import { CategoryNode } from './CategoryNode';

function guid(): string {
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function s4(): string {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

const TREE_DATA: CategoryNode[] = [
  {
    guid: guid(),
    title: 'Category 1',
    children: [
      { guid: guid(), title: 'Sub-category 1' },
      { guid: guid(), title: 'Sub-category 2' },
      { guid: guid(), title: 'Sub-category 3' },
    ],
  },
  {
    guid: guid(),
    title: 'Category 2',
    children: [
      {
        guid: guid(),
        title: 'Sub-category 1',
        children: [{ guid: guid(), title: 'Sub/Sub-category 1' }, { guid: guid(), title: 'Sub/Sub-category 2' }],
      },
      {
        guid: guid(),
        title: 'Sub-category 2',
        children: [{ guid: guid(), title: 'Sub/Sub-category 1' }, { guid: guid(), title: 'Sub/Sub-category 2' }],
      },
    ],
  },
];

@Component({
  selector: 'dr-categories-tree',
  templateUrl: './categories-tree.component.html',
  styleUrls: ['./categories-tree.component.scss'],
})
export class CategoriesTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();

  selectedNode: CategoryNode = new CategoryNode();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: CategoriesApiService,
    private service: CategoriesService,
  ) {}

  ngOnInit() {
    this.getTree();
  }

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  selectCategory(node: CategoryNode): void {
    this.selectedNode = node;
    this.filterByCategory();
  }

  private filterByCategory(): Promise<boolean> {
    this.service.category = this.selectedNode;
    return this.router.navigate(['./'], {
      // Filter parameter has to be set once API is ready
      queryParams: {
        $category: `categoryId eq ${this.selectedNode.guid}`,
      },
      relativeTo: this.activatedRoute,
    });
  }

  private getTree(): void {
    this.api
      .getTree(0)
      .then(tree => (this.dataSource.data = tree))
      .catch(err => (this.dataSource.data = TREE_DATA));
  }
}
