import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { NotificationsModule } from '../../shared/components/notifications/notifications.module';
import { SharedModule } from '../../shared/shared.module';

import { CategoryTreeManagmentComponent } from './category-tree-managment.component';

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
