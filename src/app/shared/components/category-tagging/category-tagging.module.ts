import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule,
} from '@angular/material';
import { SharedModule } from 'app/shared/shared.module';

import { CategoryTaggingComponent } from './category-tagging.component';

const matModules = [
  MatAutocompleteModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatChipsModule,
  MatTooltipModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [CategoryTaggingComponent],
  exports: [CategoryTaggingComponent],
  imports: [CommonModule, SharedModule, ...matModules],
})
export class CategoryTaggingModule {}
