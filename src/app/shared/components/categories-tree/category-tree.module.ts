import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatRippleModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { SharedModule } from 'app/shared/shared.module';

import { CategoryTreeComponent } from './category-tree.component';

const MatModules = [
  MatTreeModule,
  MatIconModule,
  MatRippleModule,
  MatTooltipModule,
];
@NgModule({
  declarations: [CategoryTreeComponent],
  imports: [SharedModule, ...MatModules],
  exports: [CategoryTreeComponent],
  providers: [],
})
export class CategoriesTreeModule {}
