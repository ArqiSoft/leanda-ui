import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
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
