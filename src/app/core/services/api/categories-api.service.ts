import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { CategoryNode } from '../../../shared/components/categories-tree/CategoryNode';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<CategoryNode[]>(`${environment.apiUrl}/categories`).toPromise();
  }

  createTree(node: CategoryNode[]): Promise<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/categories`, node).toPromise();
  }

  getTree(id: number): Promise<CategoryNode[]> {
    return this.http.get<CategoryNode[]>(`${environment.apiUrl}/categories/${id}/tree`).toPromise();
  }

  updateTree(id: number, node: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/${id}/tree`, node).toPromise();
  }

  updateTreeNode(id: number, nodeId: number, node: CategoryNode[]): Promise<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/${id}/tree/${nodeId}`, node).toPromise();
  }
}
