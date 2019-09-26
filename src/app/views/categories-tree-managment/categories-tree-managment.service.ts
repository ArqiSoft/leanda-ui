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
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `CategoryNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): CategoryNode[] {
    return Object.keys(obj).reduce<CategoryNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new CategoryNode();
      node.title = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.title = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /**
   * Add an item to to-do list
   * @param parent Parent CategoryNode
   * @param name Title of the category to be pushed as child
   */
  insertItem(parent: CategoryNode, name: string) {
    if (parent.children) {
      parent.children.push({ title: name } as CategoryNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: CategoryNode, name: string) {
    node.title = name;
    this.dataChange.next(this.data);
  }
}
