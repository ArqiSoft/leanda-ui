import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule, Routes } from '@angular/router';

import { NotificationsModule } from '../../shared/components/notifications/notifications.module';
import { SharedModule } from '../../shared/shared.module';

import { CategoryTreeManagmentComponent } from './category-tree-management.component';

const routes: Routes = [
  { path: '', component: CategoryTreeManagmentComponent },
];

const MatModules = [
  MatTreeModule,
  MatIconModule,
  MatRippleModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatTreeModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [CategoryTreeManagmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotificationsModule,
    ...MatModules,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class CategoryTreeManagmentModule {}

export const routedComponents = [CategoryTreeManagmentComponent];
