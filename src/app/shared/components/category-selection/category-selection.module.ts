import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
} from '@angular/material';
import { SharedModule } from 'app/shared/shared.module';

import { CategorySelectionComponent } from './category-selection.component';

const matModules = [
  MatAutocompleteModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [CategorySelectionComponent],
  imports: [CommonModule, SharedModule, ...matModules],
})
export class CategorySelectionModule {}
