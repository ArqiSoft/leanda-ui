import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';

import { CategoryTreeApiService } from '../../../core/services/api/category-tree-api.service';
import { NodesApiService } from '../../../core/services/api/nodes-api.service';
import { BrowserDataBaseService } from '../../../core/services/browser-services/browser-data-base.service';
import { BrowserDataService } from '../../../core/services/browser-services/browser-data.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { EEntityFilter, ICounter } from '../../models/entity-filter';
import { EntityCountsService } from '../entity-counts/entity-counts.service';
import { SidebarContentService } from '../sidebar-content/sidebar-content.service';

import { CategoryNode, CategoryTree } from './models/category-node';

@Component({
  selector: 'dr-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss'],
  providers: [
    { provide: BrowserDataBaseService, useClass: BrowserDataService },
  ],
})
export class CategoryTreeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();
  entitiyFilter: ICounter;
  lastShownPopoverName: string;
  lastShownPopoverTimeoutId: any;

  selectedNode: CategoryNode = { id: '', title: 'None' };
  currentFilter: EEntityFilter = undefined;

  constructor(
    public sidebarContent: SidebarContentService,
    public dataService: BrowserDataBaseService,
    private service: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: CategoryTreeApiService,
    private entityCounterService: EntityCountsService,
    private nodesApi: NodesApiService,
  ) {}

  private get categories(): CategoryTree[] {
    return this.service.treeList;
  }

  ngOnInit(): void {
    this.service.selectedNode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(node => (this.selectedNode = node));
    this.service.activeTree$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tree => (this.dataSource.data = tree));

    this.nodesApi
      .getNodeWithFilter({ pageNumber: 1, pageSize: 20 })
      .subscribe(
        (result: { data: []; page: { totalCount: number } }) =>
          (this.entityCounterService.entities.find(k => k.key === 'all').count =
            result.page.totalCount || 0),
      );

    this.entitiyFilter = this.entityCounterService.getCounter(
      EEntityFilter.ALL,
    );
    this.currentFilter = this.entityCounterService.activeFilter;

    this.getCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  hasChild = (_: number, node: CategoryNode) =>
    !!node.children && node.children.length > 0

  selectCategory(node: CategoryNode): void {
    this.service.selectedNode = node;
    this.filterByCategory();
  }

  displayAllFiles(): void {
    this.service.selectedNode = <CategoryNode>{ id: '' };
    this.entityCounterService.activeFilter = this.currentFilter =
      EEntityFilter.ALL;
    this.selectedNode = { title: 'None', id: '' };
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
    });
  }

  showPopover(popoverName: string) {
    if (
      this.lastShownPopoverName === popoverName &&
      this.lastShownPopoverTimeoutId
    ) {
      clearTimeout(this.lastShownPopoverTimeoutId);
      this.lastShownPopoverTimeoutId = null;
    }

    this[this.lastShownPopoverName] = false;
    this.lastShownPopoverName = popoverName;
    this[popoverName] = true;
  }

  hidePopover(popoverName: string | number) {
    if (this.lastShownPopoverTimeoutId) {
      clearTimeout(this.lastShownPopoverTimeoutId);
      this.lastShownPopoverTimeoutId = null;
    }

    this.lastShownPopoverTimeoutId = setTimeout(() => {
      this[popoverName] = false;
    }, 500);
  }

  private filterByCategory(): Promise<boolean> {
    this.service.selectedNode = this.selectedNode;
    // GET /api/categoryentities/categories/{categoryid}
    return this.router.navigate(['./'], {
      // Filter parameter has to be set once API is ready
      queryParams: {
        $category: `${this.selectedNode.title}`,
      },
      relativeTo: this.activatedRoute,
    });
  }

  private getCategories(): void {
    this.dataService.browserLoading = true;
    this.api
      .getTreeList()
      .pipe(
        map((list: CategoryTree[]) => (this.service.treeList = list)),
        tap(() => this.getTree(this.categories[0].id)),
        catchError((err: any) => {
          this.service.treeList = [];
          this.dataService.browserLoading = false;
          return throwError(err);
        }),
      )
      .subscribe(
        () => (this.dataService.browserLoading = false),
        (error: HttpErrorResponse) => console.error(),
      );
  }

  private getTree(id: string): void {
    this.api
      .getTree(id)
      .subscribe(
        (tree: CategoryTree) =>
        {
          this.service.activeTree = tree.nodes;
          this.dataSource.data = tree.nodes;
        },
        (err: any) => console.error(`Coudn't retrieve tree with id - ${id}`),
      );
  }
}
