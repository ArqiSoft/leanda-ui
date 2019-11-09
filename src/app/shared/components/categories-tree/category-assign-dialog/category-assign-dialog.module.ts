import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

import { CategoryAssignDialogComponent } from './category-assign-dialog.component';

@NgModule({
  declarations: [CategoryAssignDialogComponent],
  exports: [CategoryAssignDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTreeModule,
    MatCheckboxModule,
  ],
  entryComponents: [CategoryAssignDialogComponent],
})
export class CategoryAssignDialogModule {}
