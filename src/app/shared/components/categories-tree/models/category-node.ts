/**
 * Category data with nested structure.
 * Each node has a name and an optiona list of children.
 */
export class CategoryNode {
  id?: string;
  title: string;
  children?: CategoryNode[];
}

export class CategoryFlatNode {
  title: string;
  level: number;
  expandable: boolean;
}
