import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'app/shared/components/categories-tree/models/category';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

import { CategoryNode, CategoryTree } from '../../../shared/components/categories-tree/models/category-node';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories/tree`);
  }

  createTree(node: CategoryNode[]): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/categories/tree`, node);
  }

  getTree(id: string): Observable<CategoryTree> {
    return this.http.get<CategoryTree>(`${environment.apiUrl}/categories/tree/${id}`);
  }

  updateTree(id: string, node: CategoryNode[]): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/tree/${id}`, node);
  }

  updateTreeNode(id: string, node: CategoryNode): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/categories/tree/${id}/${node.id}`, node);
  }

  deleteTreeNode(id: string, node: CategoryNode, version: number) {
    return this.http.delete<boolean>(`${environment.apiUrl}/categories/tree/${id}/${node.id}?$version=${version}`);
  }

  getFileTreeNodes(file_id: string, category_id?: string): Observable<CategoryNode[]> {
    // category_id will be used when Leanda will work wit multiple categories
    if (category_id) {
      return this.http.get<CategoryNode[]>(`${environment.apiUrl}/categories/${category_id}/${file_id}/tree`);
    }
    // return this.http.get<CategoryNode[]>(`${environment.apiUrl}/categories/0/${file_id}/tree`);
  }
}
