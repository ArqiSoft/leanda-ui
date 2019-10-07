import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { EEntityFilter, ICounter } from 'app/shared/models/entity-filter';
import { catchError, map, tap } from 'rxjs/operators';

import { CategoriesApiService } from '../../../core/services/api/categories-api.service';
import { EntityCountsService } from '../entity-counts/entity-counts.service';
import { SidebarContentService } from '../sidebar-content/sidebar-content.service';

import { CategoriesService } from './categories.service';
import { Category } from './models/category';
import { CategoryNode, CategoryTree } from './models/category-node';

@Component({
  selector: 'dr-categories-tree',
  templateUrl: './categories-tree.component.html',
  styleUrls: ['./categories-tree.component.scss'],
})
export class CategoriesTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();
  entitiyFilter: ICounter;
  lastShownPopoverName: string;
  lastShownPopoverTimeoutId: any;

  selectedNode: CategoryNode = { title: 'None' };
  currentFilter: EEntityFilter = undefined;

  constructor(
    public sidebarContent: SidebarContentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: CategoriesApiService,
    private service: CategoriesService,
    private entityCounterService: EntityCountsService,
  ) {}

  private get categories(): Category[] {
    return this.service.categories;
  }

  ngOnInit() {
    this.service.selectedCategoryAsync.subscribe(node => (this.selectedNode = node));
    this.service.activeTreeAsync.subscribe(tree => (this.dataSource.data = tree));

    this.entityCounterService.updateCounters();
    this.entitiyFilter = this.entityCounterService.getCounter(EEntityFilter.ALL);
    this.currentFilter = this.entityCounterService.activeFilter;

    this.getCategories();

    console.log(this.service.activeTree);
    console.log(this.service.categories);
  }

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  selectCategory(node: CategoryNode): void {
    this.service.selectedCategory = node;
    this.filterByCategory();
  }

  displayAllFiles(): void {
    this.entityCounterService.activeFilter = this.currentFilter = EEntityFilter.ALL;
    this.selectedNode = { title: 'None' };
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
    });
  }

  showPopover(popoverName: string) {
    if (this.lastShownPopoverName === popoverName && this.lastShownPopoverTimeoutId) {
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
    this.service.selectedCategory = this.selectedNode;
    return this.router.navigate(['./'], {
      // Filter parameter has to be set once API is ready
      queryParams: {
        $category: `categoryId eq ${this.selectedNode.id}`,
      },
      relativeTo: this.activatedRoute,
    });
  }

  private getCategories(): void {
    this.api
      .getCategories()
      .pipe(
        map((list: Category[]) => (this.service.categories = list)),
        tap(() => this.getTree(this.categories[0].id)),
        catchError((err: any) => (this.service.categories = [])),
      )
      .subscribe(() => null, (error: HttpErrorResponse) => console.error());
  }

  private getTree(id: string): void {
    this.api
      .getTree(id)
      .subscribe((tree: CategoryTree) => (this.dataSource.data = this.service.activeTree = tree.nodes), (err: any) => console.error(err));
  }
}
