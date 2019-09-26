import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'app/shared/components/categories-tree/models/category';
import { environment } from 'environments/environment';

import { CategoryNode } from '../../../shared/components/categories-tree/models/category-node';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  constructor(private http: HttpClient) {}

  getCategories(): Promise<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`).toPromise();
  }

  createTree(node: CategoryNode[]): Promise<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/categories`, node).toPromise();
  }

  getTree(id: string): Promise<CategoryNode[]> {
    return this.http.get<CategoryNode[]>(`${environment.apiUrl}/categories/${id}/tree`).toPromise();
  }

  updateTree(id: string, node: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/${id}/tree`, node).toPromise();
  }

  updateTreeNode(id: string, nodeId: number, node: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/${id}/tree/${nodeId}`, node).toPromise();
  }
}
