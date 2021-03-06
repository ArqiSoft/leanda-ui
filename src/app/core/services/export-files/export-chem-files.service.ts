import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExportDialogComponent } from 'app/shared/components/export-dialog/export-dialog.component';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ExportChemFilesService {
  exportPreview: ExportDialogComponent;

  constructor(private http: HttpClient) {}

  // getFilesProperties(filesId: string[]) {
  //   const observables = filesId.map(id => this.http.get(environment.apiUrl + `/entities/files/${id}`));
  //   Observable.forkJoin(observables).subscribe(result => {
  //     this.exportPreview.propertiesList = result.map((x: any) => x.properties);
  //     this.exportPreview.crossFileFilter();
  //   });
  // }

  getFileProperties(fileId: string[]) {
    return fileId.map(id => this.http.get(`${environment.apiUrl}/entities/files/${id}`));
  }

  exportChemFiles(data: { BlobId: string; Format: any; Properties: any[] }) {
    this.http.post(`${environment.apiUrl}/exports/files`, data).subscribe(dataOutput => {}, error => {});
  }
}
