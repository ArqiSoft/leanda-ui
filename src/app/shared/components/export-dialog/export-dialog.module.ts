import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from 'app/shared/shared.module';
import { StringTrimModule } from '../string-trim/string-trim.module';
import { ExportDialogComponent } from './export-dialog.component';

const MatModules = [
  MatExpansionModule,
  MatDialogModule,
  MatListModule,
  MatSlideToggleModule,
];

@NgModule({
  imports: [SharedModule, ...MatModules, StringTrimModule],
  exports: [ExportDialogComponent],
  declarations: [ExportDialogComponent],
  providers: [],
})
export class ExportDialogModule { }
