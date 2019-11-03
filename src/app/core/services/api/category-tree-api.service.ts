import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'app/shared/components/categories-tree/models/category';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';

import {
  CategoryNode,
  CategoryTree,
} from '../../../shared/components/categories-tree/models/category-node';

@Injectable({
  providedIn: 'root',
})
export class CategoryTreeApiService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categorytrees/tree`);
  }

  createTree(node: CategoryNode[]): Observable<string> {
    return this.http.post<string>(
      `${environment.apiUrl}/categorytrees/tree`,
      node,
      { observe: 'body', responseType: 'text' as 'json' },
    );
  }

  deleteTree(id: string, version: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${environment.apiUrl}/categorytrees/tree/${id}?$version=${version}`,
    );
  }

  getTree(id: string): Observable<CategoryTree> {
    return this.http.get<CategoryTree>(
      `${environment.apiUrl}/categorytrees/tree/${id}`,
    );
  }

  updateTree(id: string, node: CategoryNode[]): Observable<boolean> {
    return this.http.put<boolean>(
      `${environment.apiUrl}/categorytrees/tree/${id}`,
      node,
    );
  }

  updateTreeNode(id: string, node: CategoryNode): Observable<any> {
    return this.http.put<any>(
      `${environment.apiUrl}/categorytrees/tree/${id}/${node._id}`,
      node,
    );
  }

  deleteTreeNode(id: string, node: CategoryNode, version: number) {
    return this.http.delete<boolean>(
      `${environment.apiUrl}/categorytrees/tree/${id}/${node._id}?$version=${version}`,
    );
  }
}
