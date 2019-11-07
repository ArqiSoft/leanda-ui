import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExportDialogComponent } from 'app/shared/components/export-dialog/export-dialog.component';
import { ExportDialogModule } from 'app/shared/components/export-dialog/export-dialog.module';
import { FolderActionsModule } from 'app/shared/components/folder-actions/folder-actions.module';
import { PropertiesEditorComponent } from 'app/shared/components/properties-editor/properties-editor.component';
import { PropertiesEditorModule } from 'app/shared/components/properties-editor/properties-editor.module';
import { SharedLinksComponent } from 'app/shared/components/shared-links/shared-links.component';
import { SharedLinksModule } from 'app/shared/components/shared-links/shared-links.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NavbarModule } from './core/navbar/navbar.module';
import { CategoryAssignDialogModule } from './shared/components/categories-tree/category-assign-dialog/category-assign-dialog.module';
import { CreateFolderComponent } from './shared/components/folder-actions/create-folder/create-folder.component';
import { DeleteFolderComponent } from './shared/components/folder-actions/delete-folder/delete-folder.component';
import { MoveFolderComponent } from './shared/components/folder-actions/move-folder/move-folder.component';
import { RenameFolderComponent } from './shared/components/folder-actions/rename-folder/rename-folder.component';
import { ImportWebPageModule } from './shared/components/import-web-page/import-web-page.module';

const dialogs = [
  SharedLinksComponent,
  PropertiesEditorComponent,
  DeleteFolderComponent,
  ExportDialogComponent,
  CreateFolderComponent,
  MoveFolderComponent,
  RenameFolderComponent,
];
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NavbarModule,
    CoreModule,
    SharedLinksModule,
    PropertiesEditorModule,
    ExportDialogModule,
    FolderActionsModule,
    ImportWebPageModule,
    CategoryAssignDialogModule,
  ],
  // because of dynamic generated components (all are dialogs)
  entryComponents: [
    ...dialogs,
  ],
  providers: [MoveFolderComponent],
  bootstrap: [AppComponent],
  schemas: [

  ],
})
export class AppModule { }
