/**
 * Category data with nested structure.
 * Each node has a name and an optiona list of children.
 */

export interface CategoryTree {
  id: string;
  createdBy: string;
  createdDateTime: string;
  updatedBy: string;
  updatedDateTime: string;
  version: number;
  nodes: CategoryNode[];
}

export class CategoryNode {
  id?: string;
  title: string;
  children?: CategoryNode[];
}

export class CategoryFlatNode {
  title: string;
  level: number;
  isExpandable: boolean;
  isEditEnabled: boolean;
  isButtonsVisible: boolean;
}
