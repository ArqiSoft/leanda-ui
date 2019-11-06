import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryEntityApiService {
  constructor(private http: HttpClient) {}

  joinParams(params: Params): string {
    let query = '';
    if (params) {
      query = Object.keys(params)
        .map(
          key =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
        )
        .join('&');
    }
    if (query.length > 0) {
      query = `?${query}`;
    }
    return query;
  }

  deleteTags(file_id: string, categoriesIdList: string[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: { ...categoriesIdList },
    };
    return this.http.delete(
      `${environment.apiUrl}/categoryentities/entities/${file_id}/categories`,
      options,
    );
  }

  getTags(file_id: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.apiUrl}/categoryentities/entities/${file_id}/categories`,
    );
  }

  addTags(file_id: string, categoriesIdList: string[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: { ...categoriesIdList },
    };
    return this.http.post(
      `${environment.apiUrl}/categoryentities/entities/${file_id}/categories`,
      options,
    );
  }

  deleteTag(file_id: string, categoryId: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/categoryentities/entities/${file_id}/categories/${categoryId}`,
    );
  }

  /**
   *
   * @param categoryId Category GUID
   * @param params PageNumber and PageSize. Ex: "pageNumber=1&pageSize=20"
   */
  getEntityWithTag(categoryId: string, params: Params): Observable<any> {
    delete params['$category'];
    const paramsUrl = params ? this.joinParams(params) : '';
    return this.http
      .get(
        `${environment.apiUrl}/categoryentities/entities/${categoryId}/categories${paramsUrl}`,
        { observe: 'response' },
      )
      .pipe(
        map(x => ({
          data: x.body as BrowserDataItem[],
          page: JSON.parse(x.headers.get('x-pagination')),
        })),
      );
  }
}
