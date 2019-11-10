import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'app/core/services/auth/auth-guard.service';
import { AuthProfileGuard } from 'app/core/services/auth/auth-profile-guard.guard';
import { environment } from 'environments/environment';

import { CapabilitiesGuard } from './core/services/guards/capabilities.guard';
import { CategoryTreeManagmentComponent } from './views/category-tree-managment/category-tree-managment.component';
import { RoleGuard } from './core/services/guards/role.guard';
import { Role } from './shared/models/roles';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./views/home-page/home-page.module').then(m => m.HomePageModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./views/about-page/about-page.module').then(
        m => m.AboutPageModule,
      ),
  },
  {
    path: 'organize/:id',
    loadChildren: () =>
      import('./views/organize-view/organize-view.module').then(
        m => m.OrganizeViewModule,
      ),
    canActivate: [AuthGuardService, AuthProfileGuard, CapabilitiesGuard],
    data: { active: environment.capabilities.login },
  },
  {
    path: 'tree-managment',
    loadChildren: () =>
      import('./views/category-tree-managment/category-tree-managment.module').then(m => m.CategoryTreeManagmentModule),
    canActivate: [AuthGuardService, AuthProfileGuard, CapabilitiesGuard, RoleGuard],
    data: { active: environment.capabilities.login, roles: Role.Admin },
  },
  {
    path: 'model',
    loadChildren: () =>
      import('./views/file-view/file-view.module').then(m => m.FileViewModule),
  },
  {
    path: 'file',
    loadChildren: () =>
      import('./views/file-view/file-view.module').then(m => m.FileViewModule),
  },
  {
    path: 'record',
    loadChildren: () =>
      import('./views/record-view/record-view.module').then(
        m => m.RecordViewModule,
      ),
  },
  {
    path: 'predict',
    loadChildren: () =>
      import('./views/prediction/prediction.module').then(
        m => m.PredictionModule,
      ),
    canActivate: [CapabilitiesGuard],
    data: { active: environment.capabilities.ssp },
  },
  {
    path: 'features',
    loadChildren: () =>
      import('./views/features/features.module').then(m => m.FeaturesModule),
    canActivate: [CapabilitiesGuard],
    data: { active: environment.capabilities.fvc },
  },
  {
    path: '404',
    loadChildren: () =>
      import('./views/errors/404/error-404.module').then(m => m.Error404Module),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
