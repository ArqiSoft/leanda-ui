import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { CategoryTaggingModule } from 'app/shared/components/category-tagging/category-tagging.module';

import { AuthService } from '../../core/services/auth/auth.service';
import { BrowserDataBaseService } from '../../core/services/browser-services/browser-data-base.service';
import { BrowserDataFileService } from '../../core/services/browser-services/browser-data-file.service';
import { BrowserDataSharedFileServiceService } from '../../core/services/browser-services/browser-data-shared-file-service.service';
import { PaginatorManagerService } from '../../core/services/browser-services/paginator-manager.service';
import { ShareElementGuard } from '../../core/services/guards/share-element.guard';
import { SharingParentResolverService } from '../../core/services/resolvers/sharing-parent-resolver.service';
import { SharingResolver } from '../../core/services/resolvers/sharing-resolver.service';
import { ExportDialogModule } from '../../shared/components/export-dialog/export-dialog.module';
import { FileViewsModule } from '../../shared/components/file-views/file-views.module';
import { NotificationsModule } from '../../shared/components/notifications/notifications.module';
import { OrganizeBrowserModule } from '../../shared/components/organize-browser/organize-browser.module';
import { OrganizeToolbarModule } from '../../shared/components/organize-toolbar/organize-toolbar.module';
import { SharedLinksModule } from '../../shared/components/shared-links/shared-links.module';
import { SidebarContentModule } from '../../shared/components/sidebar-content/sidebar-content.module';
import { SharedModule } from '../../shared/shared.module';

import { FileViewComponent } from './file-view.component';
export let dataServiceFactory = (
  auth: AuthService,
  sharedProvider: BrowserDataSharedFileServiceService,
  dataFileService: BrowserDataFileService,
) => {
  if (auth.user && auth.user.profile) {
    return dataFileService;
  } else {
    return sharedProvider;
  }
};

const routes: Routes = [
  {
    path: ':id',
    component: FileViewComponent,
    canActivate: [ShareElementGuard],
    resolve: {
      share: SharingResolver,
      shareParent: SharingParentResolverService,
    },
  },
];

const modules = [
  NotificationsModule,
  SidebarContentModule,
  OrganizeToolbarModule,
  OrganizeBrowserModule,
  FileViewsModule,
  SharedLinksModule,
  ExportDialogModule,
  MatDialogModule,
  MatRippleModule,
  MatChipsModule,
  MatIconModule,
  CategoryTaggingModule,
];

@NgModule({
  imports: [SharedModule, ...modules, RouterModule.forChild(routes)],
  exports: [FileViewComponent],
  declarations: [FileViewComponent],
  providers: [
    PaginatorManagerService,
    {
      provide: BrowserDataBaseService,
      useFactory: dataServiceFactory,
      deps: [
        AuthService,
        BrowserDataSharedFileServiceService,
        BrowserDataFileService,
      ],
    },
    BrowserDataSharedFileServiceService,
    BrowserDataFileService,
    SharingResolver,
    SharingParentResolverService,
    ShareElementGuard,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FileViewModule {}
