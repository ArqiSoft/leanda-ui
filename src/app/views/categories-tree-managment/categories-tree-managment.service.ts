import { Injectable } from '@angular/core';
import { CategoryNode } from 'app/shared/components/categories-tree/models/category-node';
import { BehaviorSubject } from 'rxjs';

/**
 * The Json object for to-do list data.
 */
const TREE_DATA: CategoryNode[] = [
  {
    title: 'Category 1',
    children: [
      {
        title: 'Sub-category 1',
      },
      {
        title: 'Sub-category 2',
      },
      {
        title: 'Sub-category 3',
      },
    ],
  },
  {
    title: 'Category 2',
    children: [
      {
        title: 'Sub-category 1',
        children: [
          {
            title: 'Sub/Sub-category 1',
          },
          {
            title: 'Sub/Sub-category 2',
          },
        ],
      },
      {
        title: 'Sub-category 2',
        children: [
          {
            title: 'Sub/Sub-category 1',
          },
          {
            title: 'Sub/Sub-category 2',
          },
        ],
      },
    ],
  },
];
@Injectable({
  providedIn: 'root',
})
export class CategoriesTreeManagmentService {
  dataChange = new BehaviorSubject<CategoryNode[]>([]);

  get data(): CategoryNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `CategoryNode` with nested
    //     file node as children.
    const data = TREE_DATA;

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Add an item to to-do list
   * @param parent Parent CategoryNode
   * @param name Title of the category to be pushed as child
   * @param hasChildren If True - adds 'children' property
   */
  insertItem(parent: CategoryNode, name: string, hasChildren: boolean) {
    if (parent.children) {
      parent.children.push({ title: name, ...() => (hasChildren ? { children: [] } : null) } as CategoryNode);
      this.dataChange.next(this.data);
    }
  }

  /**
   * Add an item to to-do list
   * @param node Current CategoryNode
   * @param title Title of the category to be pushed as child
   */
  updateItem(node: CategoryNode, title: string) {
    node.title = title;
    this.dataChange.next(this.data);
  }

  removeCategory(deletedNode: CategoryNode) {
    this.dataChange.next(this.data.filter(node => node !== deletedNode));
  }

  removeSubcategory(parent: CategoryNode, deletedNode: CategoryNode) {
    if (parent.children) {
      if (deletedNode.title === '') {
        parent.children = parent.children.filter(childNode => childNode === parent.children.find(node => node === deletedNode));
      } else {
        parent.children = parent.children.filter(node => node !== deletedNode);
      }

      this.dataChange.next(this.data);
    }
  }
}
