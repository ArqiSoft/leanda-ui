import { Injectable } from '@angular/core';
import { CategoriesApiService } from 'app/core/services/api/categories-api.service';
import { Category } from 'app/shared/components/categories-tree/models/category';
import { CategoryNode } from 'app/shared/components/categories-tree/models/category-node';
import { BehaviorSubject } from 'rxjs';

/**
 * The Mock array of category treesdi.
 */
const TREE_DATA: CategoryNode[] = [
  {
    title: 'Node 1',
    children: [
      {
        title: 'Level 1: Node 1',
      },
      {
        title: 'Level 1: Node 2',
      },
      {
        title: 'Level 1: Node 3',
      },
    ],
  },
  {
    title: 'Node 2',
    children: [
      {
        title: 'Level 1: Node 1',
        children: [
          {
            title: 'Level 2: Node 1',
          },
          {
            title: 'Level 2: Node 2',
          },
        ],
      },
      {
        title: 'Level 1: Node 2',
        children: [
          {
            title: 'Level 2: Node 1',
          },
          {
            title: 'Level 2: Node 2',
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

  private _cateogories = new BehaviorSubject<Category[]>([]);

  get data(): CategoryNode[] {
    return this.dataChange.value;
  }

  get categories(): Category[] {
    return this._cateogories.value;
  }

  constructor(private api: CategoriesApiService) {
    this.initialize();
  }

  initialize() {
    this.getCategories().then(categories => {
      this._cateogories.next(categories);
      if (categories.length > 0) {
        this.getCategoryTree(this.categories[0].id);
      }
    });
  }

  /**
   * Add an item to to-do list
   * @param parent Parent CategoryNode
   * @param name Title of the category to be pushed as child
   * @param hasChildren If True - adds 'children' property
   */
  insertItem(parent: CategoryNode, name: string) {
    if (parent.children) {
      parent.children.push({ title: name } as CategoryNode);
      this.dataChange.next(this.data);
    }
  }

  /**
   * Add an item to to-do list
   * @param node Current CategoryNode
   * @param title Title of the category to be pushed as child
   */
  updateItem(node: CategoryNode, title: string, children: boolean) {
    if (children) {
      node.children = [];
    }
    node.title = title;
    this.dataChange.next(this.data);
  }

  /**
   * This method removes the first by deepnest elements of CategoryNode[]
   * @param deletedNode the node that has to be deleted
   */
  removeNode(deletedNode: CategoryNode) {
    this.dataChange.next(this.data.filter(node => node !== deletedNode));
  }

  removeNestedNode(parent: CategoryNode, deletedNode: CategoryNode) {
    if (parent.children) {
      if (deletedNode.title === '') {
        parent.children = parent.children.filter(childNode => childNode === parent.children.find(node => node === deletedNode));
      } else {
        parent.children = parent.children.filter(node => node !== deletedNode);
      }

      this.dataChange.next(this.data);
    }
  }

  createCategory(tree: CategoryNode[]): void {
    this.api.createTree(tree).then(id => this.getCategoryTree(id));
  }

  private getCategories(): Promise<Category[]> {
    return this.api.getCategories();
  }

  private getCategoryTree(id: string): void {
    this.api.getTree(id).then(tree => this.dataChange.next(tree.nodes));
  }

  private updateCategoryTree(id: string, nodes: CategoryNode[]) {
    this.api.updateTree(id, nodes);
  }

  private updateCategoryTreeNode(id: string, node: CategoryNode, nodes: CategoryNode[]) {
    this.api.updateTreeNode(id, node.id, nodes);
  }
}
