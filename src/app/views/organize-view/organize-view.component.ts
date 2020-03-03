/* tslint:disable:no-access-missing-member */
// TODO remove it after lint bug will fix
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { SidebarContentService } from 'app/shared/components/sidebar-content/sidebar-content.service';
import { environment } from 'environments/environment';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { Observable, Subscription } from 'rxjs';

import { BlobsApiService } from '../../core/services/api/blobs-api.service';
import { EntitiesApiService } from '../../core/services/api/entities-api.service';
import { FoldersApiService } from '../../core/services/api/folders-api.service';
import { NodesApiService } from '../../core/services/api/nodes-api.service';
import { NotificationsApiService } from '../../core/services/api/notifications-api.service';
import { WebPagesApiService } from '../../core/services/api/web-pages-api.service';
import { AuthService } from '../../core/services/auth/auth.service';
import {
  BrowserDataBaseService,
  BrowserViewState,
} from '../../core/services/browser-services/browser-data-base.service';
import {
  BrowserDataService,
  IBrowserEvent,
} from '../../core/services/browser-services/browser-data.service';
import { PaginatorManagerService } from '../../core/services/browser-services/paginator-manager.service';
import {
  IQuickFilter,
  QuickFilterService,
} from '../../core/services/browser-services/quick-filter.service';
import { CategoryService } from '../../core/services/category/category.service';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { PageTitleService } from '../../core/services/page-title/page-title.service';
import { SignalrService } from '../../core/services/signalr/signalr.service';
import { ExportDialogComponent } from '../../shared/components/export-dialog/export-dialog.component';
import { CreateFolderComponent } from '../../shared/components/folder-actions/create-folder/create-folder.component';
import { DeleteFolderComponent } from '../../shared/components/folder-actions/delete-folder/delete-folder.component';
import {
  MoveDialogType,
  MoveFolderComponent,
} from '../../shared/components/folder-actions/move-folder/move-folder.component';
import { RenameFolderComponent } from '../../shared/components/folder-actions/rename-folder/rename-folder.component';
// import { MachineLearningService } from '../../shared/components/full-screen-dialogs/machine-learning/machine-learning.service';
import { ActionViewService } from '../../shared/components/full-screen-dialogs/action-view.service';
import { ImportWebPageComponent } from '../../shared/components/import-web-page/import-web-page.component';
import {
  NotificationType,
  SignalREvent,
} from '../../shared/components/notifications/events.model';
import { NotificationCommonItemComponent } from '../../shared/components/notifications/notifications-side-bar/notification-common-item/notification-common-item.component';
import { NotificationUploadItemComponent } from '../../shared/components/notifications/notifications-side-bar/notification-upload-item/notification-upload-item.component';
import {
  NotificationItem,
  NotificationMessage,
  NotificationUploadMessage,
} from '../../shared/components/notifications/notifications.model';
import {
  BrowserDataItem,
  BrowserOptions,
  NodeType,
} from '../../shared/components/organize-browser/browser-types';
import { OrganizeBrowserComponent } from '../../shared/components/organize-browser/organize-browser.component';
import { ToolbarButtonType } from '../../shared/components/organize-toolbar/organize-toolbar.model';
import { SharedLinksComponent } from '../../shared/components/shared-links/shared-links.component';

import {
  ActionMenuItemData,
  ActionMenuItemsManager,
  ContextMenu,
  ESidebarTab,
  ISidebarTab,
} from './organize-view.model';
import { CategoryNode } from 'app/shared/components/categories-tree/models/category-node';

@Component({
  selector: 'dr-organize-view',
  templateUrl: './organize-view.component.html',
  styleUrls: ['./organize-view.component.scss'],
  providers: [
    { provide: BrowserDataBaseService, useClass: BrowserDataService },
    PaginatorManagerService,
    QuickFilterService,
  ],
})
export class OrganizeViewComponent extends BrowserOptions
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(OrganizeBrowserComponent)
  browser: OrganizeBrowserComponent;

  @ViewChild(ImportWebPageComponent)
  uploadWebPage: ImportWebPageComponent;
  @ViewChild('fileUpload', { static: true }) fileInput: ElementRef;

  @ViewChild('defaultContextMenu', { static: true })
  public defaultContextMenu: ContextMenuComponent;
  componentData = null;
  activeToolbarButtons: ToolbarButtonType[] = [
    ToolbarButtonType.tile,
    ToolbarButtonType.table,
    ToolbarButtonType.subMenu,
    ToolbarButtonType.search,
    ToolbarButtonType.upload,
    ToolbarButtonType.addAction,
    ToolbarButtonType.uploadWebPage,
    // ToolbarButtonType.export,
    ToolbarButtonType.createPublicLink,
  ];

  folderContextMenuManager: ActionMenuItemsManager = new ActionMenuItemsManager();
  disabledMenu = false;
  sidebarTab: any = ESidebarTab;
  currentSidebarTab: ESidebarTab;

  tabs: ISidebarTab[] = [
    {
      title: 'Filters',
      type: ESidebarTab.FILTERS,
      tooltip: 'List of Filters',
    },
    {
      title: 'Categories',
      type: ESidebarTab.CATEGORIES,
      tooltip: 'Categories Tree',
    },
  ];

  private updateSubscription: Subscription;
  private browserEventSubscription: Subscription = null;
  private idUrlParameter: string;
  private routeEventsSubscription: Subscription;

  get categoriesTree(): Observable<CategoryNode[]> {
    return this.categoryService.activeTree$;
  }

  get currentView() {
    return localStorage.getItem('currentBrowserViewFor:nodes-view') || 'tile';
  }

  get display(): boolean {
    return this.actionViewService.isActionViewActive;
  }

  set display(value: boolean) {
    this.actionViewService.isActionViewActive = value;
  }

  constructor(
    public foldersApi: FoldersApiService,
    public entitiesApi: EntitiesApiService,
    // public mlFactoryService: MachineLearningService,
    public actionViewService: ActionViewService,
    private nodesApi: NodesApiService,
    private blobsApi: BlobsApiService,
    private webPagesApi: WebPagesApiService,
    private auth: AuthService,
    private signalr: SignalrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationsService,
    public dialog: MatDialog,
    private dataService: BrowserDataBaseService,
    private paginator: PaginatorManagerService,
    private quickFilter: QuickFilterService,
    private pageTitle: PageTitleService,
    private notificationsApi: NotificationsApiService,
    private contextMenuService: ContextMenuService,
    private categoryService: CategoryService,
    private sidebarService: SidebarContentService,
  ) {
    super(foldersApi, entitiesApi);

    // File folders context menu
    this.folderContextMenuManager.add(
      new ActionMenuItemData(
        ContextMenu.CREATE,
        '/img/svg/imp/add-folder.svg',
        true,
        true,
        item => this.openCreateFolderDialog(),
      ),
    );

    this.folderContextMenuManager.add(
      new ActionMenuItemData(
        ContextMenu.DELETE,
        '/img/svg/draft-menu/delete.svg',
        true,
        true,
        item => {
          this.openDeleteItemDialog();
        },
      ),
    );

    this.folderContextMenuManager.add(
      new ActionMenuItemData(
        ContextMenu.RENAME,
        '/img/svg/draft-menu/rename.svg',
        true,
        true,
        item => {
          // this.browser.editMode = true
          this.openRenameItemDialog();
        },
      ),
    );

    this.folderContextMenuManager.add(
      new ActionMenuItemData(
        ContextMenu.MOVE,
        '/img/svg/draft-menu/move.svg',
        true,
        true,
        item => {
          this.openMoveItemDialog();
        },
      ),
    );

    // const machineLearning = new ActionMenuItemData(ContextMenu.MACHINE_LEARNING, '/img/svg/ml.svg',
    //   true,
    //   true,
    //   (item) => { });
    // machineLearning.subItems = [
    //   new ActionMenuItemData(ContextMenu.TRAIN_ML_MODEL, '/img/svg/ml.svg', true, true,
    //     (item) => {
    //       if (this.dataService.getSelectedItems().length > 0) {
    //         this.openTrainModelView();
    //       }
    //     }),
    //   new ActionMenuItemData(ContextMenu.RUN_ML_PREDICTION, '/img/svg/ml.svg', true, true,
    //     (item) => {
    //       this.openPredictModelView();
    //     }),
    // ];
    // this.folderContextMenuManager.add(machineLearning);
    this.folderContextMenuManager.add(
      new ActionMenuItemData(
        ContextMenu.DOWNLOAD,
        '/img/svg/material/ic_file_download_black_24px.svg',
        false,
        false,
        item => {
          const blobUrl = this.blobsApi.getBlobUrl(
            item ? item : this.dataService.getSelectedItems()[0],
            true,
          );
          window.open(blobUrl, '_self');
        },
      ),
    );

    if (environment.capabilities.webPage) {
      this.folderContextMenuManager.add(
        new ActionMenuItemData(
          ContextMenu.UPLOAD_WEB_PAGE,
          '/img/svg/material/ic_pages_black_24px.svg',
          true,
          true,
          item => {
            this.openWebPageImportDialog();
          },
        ),
      );
    }

    this.folderContextMenuManager.add(
      new ActionMenuItemData(
        ContextMenu.UPLOAD,
        '/img/svg/material/ic_file_upload_black_24px.svg',
        true,
        true,
        item => this.fileInput.nativeElement.click(),
      ),
    );

    this.folderContextMenuManager.add(
      new ActionMenuItemData(
        ContextMenu.ENTITY_LOCATION,
        '/img/svg/import.svg',
        true,
        true,
        item => {
          this.goToFileLocation(item);
        },
      ),
    );

    const exportFile = new ActionMenuItemData(
      ContextMenu.EXPORT,
      '/img/svg/draft-menu/export.svg',
      true,
      true,
      item => {
        this.openExportDialog('csv');
      },
    );
    exportFile.subItems = [
      new ActionMenuItemData(
        ContextMenu.EXPORT_TO_CSV,
        '/img/svg/material/ic_file_download_black_24px.svg',
        true,
        true,
        item => {
          this.openExportDialog('csv');
        },
      ),
      new ActionMenuItemData(
        ContextMenu.EXPORT_TO_SDF,
        '/img/svg/material/ic_file_download_black_24px.svg',
        true,
        true,
        item => {
          this.openExportDialog('sdf');
        },
      ),
      // new ActionMenuItemData(ContextMenu.EXPORT_TO_SPL, '/img/svg/material/ic_file_download_black_24px.svg',
      //   true,
      //   true,
      //   (item) => {
      //     this.openExportDialog('spl');
      //   }),
    ];
    this.folderContextMenuManager.add(exportFile);
    const sharingSettings = new ActionMenuItemData(
      ContextMenu.SHARING_SETTINGS,
      '/img/svg/material/ic_link_black_24px.svg',
      true,
      true,
      item => {},
    );
    sharingSettings.subItems = [
      new ActionMenuItemData(
        ContextMenu.CREATE_PUBLIC_LINK,
        '/img/svg/material/ic_link_black_24px.svg',
        true,
        true,
        item => {
          this.openSharedLinksDialog();
        },
      ),
      new ActionMenuItemData(
        ContextMenu.CHANGE_SHARING_SETTINGS,
        '/img/svg/material/ic_link_black_24px.svg',
        true,
        true,
        item => {
          this.openSharedLinksDialog();
        },
      ),
    ];
    this.folderContextMenuManager.add(sharingSettings);

    // this.breadcrumbs = [{ text: 'DRAFTS', link: '/organize/drafts' }];

    this.signalr.organizeUpdate.subscribe((x: SignalREvent) => {
      this.updateSubject.next(x);
    });
  }

  isUserAdmin = (): boolean => {
    if (this.auth.user && this.auth.user.profile['user_role']) {
      return this.auth.user.profile.user_role.includes('leanda-admin');
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.currentSidebarTab = this.sidebarService.sidebarTab;
    this.dataService.subscribeToEvents();
    this.activatedRoute.queryParams.subscribe((queryParam: Params) => {
      if ('pageNumber' in queryParam) {
        this.paginator.paging.current = queryParam['pageNumber'];
      }

      this.paginator.initPaginator(
        'pageNumber' in queryParam ? queryParam['pageNumber'] : null,
        'pageSize' in queryParam ? queryParam['pageSize'] : null,
      );

      // // Init filter side bar
      const p: Params = [];
      let applyFilter = false;

      for (const i in queryParam) {
        if (queryParam.hasOwnProperty(i)) {
          if (
            (i === '$filter' &&
              this.quickFilter.getFilterKeyByValue(queryParam[i])) ||
            i !== '$filter'
          ) {
            p[i] = queryParam[i];
          }
          if (
            i === '$filter' &&
            this.quickFilter.getFilterKeyByValue(queryParam[i])
          ) {
            applyFilter = true;
            const key = this.quickFilter.getFilterKeyByValue(queryParam[i]);
            this.quickFilter.initView({ filterValue: key, isFilterSet: true });
          }
        }
      }

      // Remove filter selection if $filter not set
      if (!applyFilter && this.quickFilter.isFilterSet) {
        this.quickFilter.initView({ filterValue: 'all', isFilterSet: false });
      }

      this.dataService.setViewParams(queryParam);
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.idUrlParameter = params['id'];
      if (String(this.idUrlParameter).toLowerCase() === 'drafts') {
        this.idUrlParameter = null;
      }
    });

    this.routeEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.initViewData();
      }
    });

    if (!this.browserEventSubscription) {
      this.browserEventSubscription = (this
        .dataService as BrowserDataService).browserEvents.subscribe(
        (eventData: IBrowserEvent) => {
          if (eventData.event.type === 'dblclick') {
            this.itemDbClick(eventData.event, eventData.item);
          } else if (eventData.event.type === 'click') {
            this.itemClick(eventData.event, eventData.item);
          }
        },
      );
    }

    this.quickFilter.filterEvents.subscribe((filterData: IQuickFilter) =>
      this.onFilterChange(filterData),
    );

    this.dataService.browserStateChange.subscribe(data => {
      this.onBrowseSearchResult(data);
    });
  }

  ngAfterViewInit(): void {
    this.initViewData();
    this.notificationsApi.getPersistentNotificationsList().subscribe(data => {
      this.notificationService.getPersistentNotificationList(data);
    });
    // setTimeout(() => {
    //   const el = document.querySelector('.table-title') as HTMLElement;
    //   el.onmouseover = () => this.disabledMenu = true;
    //   el.onmouseout = () => this.disabledMenu = false;
    // }, 2500);
  }

  initViewData() {
    this.dataService.setActiveNode(this.idUrlParameter).subscribe(() => {
      this.dataService.initBreadCrumbs(this.idUrlParameter).subscribe(() => {
        if ('$filter' in this.dataService.viewParams) {
          this.dataService.browserServiceState = BrowserViewState.filterBrowser;
          this.folderContextMenuManager.filtered = true;
          this.dataService.breadcrumbs = [
            { text: 'DRAFTS', width: null, link: '/organize/drafts' },
            {
              text: `FILTER: ${this.quickFilter.getFilterTitle(
                this.dataService.viewParams['$filter'],
              )}`,
              width: null,
              link: '/organize/drafts',
            },
          ];
          this.activeToolbarButtons = [
            ToolbarButtonType.tile,
            ToolbarButtonType.table,
            ToolbarButtonType.subMenu,
            ToolbarButtonType.search,
            ToolbarButtonType.export,
          ];
        } else if (`$category` in this.dataService.viewParams) {
          this.dataService.browserServiceState =
            BrowserViewState.categoryBrowser;
          this.folderContextMenuManager.filtered = true;
          this.dataService.breadcrumbs = [
            { text: 'DRAFTS', width: null, link: '/organize/drafts' },
            {
              text: `CATEGORY: ${this.categoryService.selectedNode.title}`,
              width: null,
              link: '/organize/drafts',
            },
          ];
          this.activeToolbarButtons = [
            ToolbarButtonType.tile,
            ToolbarButtonType.table,
            ToolbarButtonType.subMenu,
            ToolbarButtonType.search,
            ToolbarButtonType.export,
          ];
        } else if ('search' in this.dataService.viewParams) {
          this.folderContextMenuManager.filtered = true;
          this.activeToolbarButtons = [
            ToolbarButtonType.tile,
            ToolbarButtonType.table,
            ToolbarButtonType.subMenu,
            ToolbarButtonType.search,
            ToolbarButtonType.export,
          ];

          this.dataService.breadcrumbs = [
            { text: 'DRAFTS', width: null, link: '/organize/drafts' },
            {
              text: `RESULT OF SEARCH: ${this.dataService.viewParams['search']}`,
              width: null,
              link: '/organize/drafts',
            },
          ];

          this.dataService.browserServiceState =
            BrowserViewState.searchResultBrowser;
        } else {
          this.dataService.browserServiceState = BrowserViewState.browser;
          this.folderContextMenuManager.filtered = false;
          this.activeToolbarButtons = [
            ToolbarButtonType.tile,
            ToolbarButtonType.table,
            ToolbarButtonType.subMenu,
            ToolbarButtonType.search,
            ToolbarButtonType.upload,
            ToolbarButtonType.addAction,
            ToolbarButtonType.uploadWebPage,
            ToolbarButtonType.export,
          ];
        }
        this.pageTitle.title = this.dataService.breadcrumbs.slice(-1)[0].text;
      });
      this.dataService.refreshData();
    });
  }

  ngOnDestroy(): void {
    this.dataService.unSubscribe();

    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }

    if (this.browserEventSubscription) {
      this.browserEventSubscription.unsubscribe();
    }

    if (this.routeEventsSubscription) {
      this.routeEventsSubscription.unsubscribe();
    }
  }

  goToFileLocation(currentItem: BrowserDataItem) {
    let parentItem: BrowserDataItem;
    this.nodesApi.getNode(currentItem.parentId).subscribe(x => {
      parentItem = new BrowserDataItem(x.body as BrowserDataItem);
      if (parentItem.isFolder() || parentItem.type === 'Model') {
        this.paginator.paging.current = 1;
        this.router.navigate([`organize/${parentItem.id}`], {
          queryParams: { pageNumber: 1, pageSize: 20 },
        });
      } else if (parentItem.getNodeType() === NodeType.Record) {
        this.router.navigate(['/record', parentItem.id]);
      } else if (parentItem.getNodeType() === NodeType.File) {
        this.router.navigate(['/file', parentItem.id]);
      } else if (parentItem.getNodeType() === NodeType.User) {
        const itemsPerPage = this.paginator.paging.itemsPerPage;
        this.nodesApi
          .getNodePageLocationNumber(currentItem.id, itemsPerPage)
          .subscribe(y => {
            this.paginator.paging.current = y.body as number;
          });
        this.router.navigate([`organize/drafts`]);
      }
    });
  }

  // openTrainModelView(): void {
  //   this.display = true;
  //   this.disabledMenu = true;
  //   this.componentData = this.mlFactoryService.setMachineLearningTrainComponent(
  //     { selectedItems: this.dataService.selectedItems[0], parentItem: this.dataService.parentItem }
  //   );
  // }

  // openPredictModelView(): void {
  //   this.display = true;
  //   this.disabledMenu = true;
  //   this.componentData = this.mlFactoryService.setMachineLearningPredictComponent(
  //     { selectedItems: this.dataService.selectedItems[0], parentItem: this.dataService.parentItem }
  //   );
  // }

  openExportDialog(fileType: string): void {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      width: '800px',
      data: { fileType, selectedItems: this.dataService.selectedItems },
    });
  }

  openSharedLinksDialog(): void {
    const dialogRef = this.dialog.open(SharedLinksComponent, {
      width: '650px',
      data: { fileInfo: this.dataService.selectedItems[0] },
    });
  }

  openCreateFolderDialog(): void {
    const dialogRef = this.dialog.open(CreateFolderComponent, {
      width: '500px',
      data: { parentItem: this.dataService.parentItem },
    });
    dialogRef.componentInstance.createFolderEvent.subscribe((name: string) => {
      this.onCreateFolder(name);
      dialogRef.close();
    });
  }

  openDeleteItemDialog(): void {
    const dialogRef = this.dialog.open(DeleteFolderComponent, {
      width: '500px',
      data: this.dataService.selectedItems,
    });
    dialogRef.componentInstance.deleteFolderEvent.subscribe(() => {
      this.onDeleteFolder();
      dialogRef.close();
    });
  }

  openMoveItemDialog(): void {
    const dialogRef = this.dialog.open(MoveFolderComponent, {
      width: '500px',
      height: '528px',
      data: {
        startFolder: this.dataService.currentItem
          ? this.dataService.parentItem
          : null,
        movedItems: this.dataService.getSelectedItems(),
        options: this.getOptions(),
        submitButtonText: 'Move to this folder',
        dialogType: MoveDialogType.FileManager,
      },
    });
    dialogRef.componentInstance.moveFolderEvent.subscribe(
      (e: { toFolder: BrowserDataItem; folder: BrowserDataItem }) => {
        this.moveFolderAction(e.folder, e.toFolder);
        dialogRef.close();
      },
    );
  }

  openRenameItemDialog(): void {
    const dialogRef = this.dialog.open(RenameFolderComponent, {
      width: '500px',
      data: { fileInfo: this.dataService.selectedItems[0] },
    });
    dialogRef.componentInstance.renameFolderEvent.subscribe(
      (e: { item: BrowserDataItem; name: string }) => {
        this.renameFolderAction(e.item, e.name);
        dialogRef.close();
      },
    );
  }

  openWebPageImportDialog(): void {
    const dialogRef = this.dialog.open(ImportWebPageComponent, {
      width: '500px',
      data: { fileInfo: this.dataService.selectedItems[0] },
    });
    dialogRef.componentInstance.importPageEvent.subscribe((url: string) => {
      this.onImportPage(url);
      dialogRef.close();
    });
  }

  onToolBarButtonClick(button_type: ToolbarButtonType) {
    if (
      button_type === ToolbarButtonType.tile ||
      button_type === ToolbarButtonType.table
    ) {
      this.browser.toolBarEvent(button_type);
    } else if (button_type === ToolbarButtonType.upload) {
      this.fileInput.nativeElement.click();
    } else if (button_type === ToolbarButtonType.addAction) {
      this.openCreateFolderDialog();
    }
  }

  onToolBarExportClick(fileType: string): void {
    this.openExportDialog(fileType);
  }

  onFileChange(event: { target: { files: any } }) {
    this.uploadFileWithNotificationBar(event.target.files);
  }

  uploadFileWithNotificationBar(filesList: any) {
    // notificationService
    if (!filesList.length) {
      return;
    }

    for (const file of filesList) {
      const formData = new FormData();
      if (this.dataService.parentItem) {
        formData.append('parentId', this.dataService.parentItem.id);
      }
      formData.append('file[]', file);
      if (file.size > environment.maxBlobUploadingFileSize) {
        const fileLimitMessage = new NotificationMessage();
        fileLimitMessage.id = fileLimitMessage.generateIdIg();
        const maxFileSize = environment.maxBlobUploadingFileSize / 1024 / 1024;
        fileLimitMessage.header = `File size exceeded: ${maxFileSize}MB`;
        fileLimitMessage.message = file.name;
        fileLimitMessage.type = NotificationType.Error;
        fileLimitMessage.actionDate = new Date();
        this.notificationService.showToastNotification(
          new NotificationItem(
            NotificationCommonItemComponent,
            fileLimitMessage,
          ),
        );
        continue;
      }
      const uploadTask: Observable<any> = this.blobsApi.uploadFiles(
        this.dataService.parentItem != null
          ? this.dataService.parentItem.id
          : null,
        formData,
      );

      const message = new NotificationUploadMessage();
      message.id = message.generateIdIg();
      message.uploadTask = uploadTask;
      message.header = 'Upload file';
      message.message = file.name;
      message.parentId = this.dataService.currentItem.id;
      message.type = NotificationType.Process;
      message.actionDate = new Date();

      const notificationItem = new NotificationItem(
        NotificationUploadItemComponent,
        message,
      );
      this.notificationService.showToastNotification(notificationItem);
    }
  }

  getItems(pageNumber: number, itemsOnPage: number): Observable<any> {
    return null;
  }

  getItem(id: string) {
    return null;
  }

  itemDbClick(event: MouseEvent, item: BrowserDataItem) {
    this.dataService.clearSelection();
    this.dataService.parentItem = item;

    if (item.isFolder()) {
      this.paginator.paging.current = 1;
      this.router.navigate([`organize/${item.id}`], {
        queryParams: { pageNumber: 1 },
      });
    } else if (item.getNodeType() === NodeType.Model) {
      this.paginator.paging.current = 1;
      // this.router.navigate(['/model', item.id]);
      this.router.navigate([`model/${item.id}`], {
        queryParams: { pageNumber: 1 },
      });
    } else {
      if (item.getNodeType() === NodeType.Record) {
        this.router.navigate(['/record', item.id]);
      } else {
        this.router.navigate(['/file', item.id]);
      }
    }
  }

  itemClick(event: MouseEvent, item: BrowserDataItem) {}

  onFileDrop(e: { dataTransfer: { files: any } }) {
    const files = e.dataTransfer.files;
    this.uploadFileWithNotificationBar(files);
  }

  onCreateFolder(folderName: string) {
    this.createFolderAction(folderName, this.dataService.parentItem);
  }

  onDeleteFolder() {
    if (this.dataService.getSelectedItems().length > 0) {
      this.deleteFolderAction(this.dataService.getSelectedItems());
      this.dataService.clearSelection();
    }
  }

  onMoveFolder(moveObj: {
    toFolder: BrowserDataItem;
    folder: BrowserDataItem;
  }) {
    this.moveFolderAction(moveObj.folder, moveObj.toFolder);
  }

  onImportPage(url: string) {
    let dataItem = new BrowserDataItem();
    if (!this.dataService.currentItem.id) {
      dataItem.id = this.auth.user.profile.sub;
    } else {
      dataItem = this.dataService.currentItem;
    }

    this.webPagesApi.importWebPage(url, dataItem);
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    // NMR-1235 Rick comment
    // this.disabledMenu = !!($event.target as HTMLElement).closest('.table-title');
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.defaultContextMenu,
      event: <any>$event,
      item: item,
    });
    this.dataService.clearSelection();
    $event.preventDefault();
    $event.stopPropagation();
  }

  public onRenameFolder(changes: { item: BrowserDataItem; name: string }) {
    this.renameFolderAction(changes.item, changes.name);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: { key: string }) {
    if (event.key === 'Delete') {
      if (this.dataService.getSelectedItems().length > 0) {
        this.openDeleteItemDialog();
      }
    }
  }

  onFilterChange(filterParams: IQuickFilter): void {
    if (filterParams.isFilterSet && filterParams.filterValue !== 'all') {
      this.router.navigate(['./'], {
        queryParams: {
          $filter: this.quickFilter.getFilterByKey(filterParams.filterValue),
        },
        relativeTo: this.activatedRoute,
      });
    } else {
      this.dataService.clearSelection();
      this.router.navigate(['./'], { relativeTo: this.activatedRoute });
    }
  }

  onBrowseSearchResult(data: { [x: string]: any }) {
    this.router.navigate(['./'], {
      queryParams: { search: data['searchString'] },
      relativeTo: this.activatedRoute,
    });
  }

  changeTab(value: ESidebarTab) {
    this.currentSidebarTab = value;
    this.sidebarService.sidebarTab = value;
  }
}
