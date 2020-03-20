import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
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
