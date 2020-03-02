import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
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
})
export class CategoryAssignDialogModule { }
