import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'app/shared/components/categories-tree/models/category';
import { environment } from 'environments/environment';

import { CategoryNode, CategoryTree } from '../../../shared/components/categories-tree/models/category-node';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  constructor(private http: HttpClient) {}

  getCategories(): Promise<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories/tree`).toPromise();
  }

  createTree(node: CategoryNode[]): Promise<string> {
    return this.http.post<string>(`${environment.apiUrl}/categories/tree`, node).toPromise();
  }

  getTree(id: string): Promise<CategoryTree> {
    return this.http.get<CategoryTree>(`${environment.apiUrl}/categories/tree/${id}`).toPromise();
  }

  updateTree(id: string, node: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/tree/${id}`, node).toPromise();
  }

  updateTreeNode(id: string, nodeId: string, node: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/tree/${id}/${nodeId}`, node).toPromise();
  }
}
