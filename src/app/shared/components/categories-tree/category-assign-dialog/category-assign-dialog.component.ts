import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material';
import { CategoryEntityApiService } from 'app/core/services/api/category-entity-api.service';
import { CategoryTreeApiService } from 'app/core/services/api/category-tree-api.service';
import { CategoryService } from 'app/core/services/category/category.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Subject, throwError, Observable } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';

import { NotificationType } from '../../notifications/events.model';
import {
  NotificationItem,
  NotificationMessage,
} from '../../notifications/notifications.model';
import { BrowserDataItem } from '../../organize-browser/browser-types';
import { CategoryTreeBase } from '../category-base';
import {
  CategoryFlatNode,
  CategoryNode,
  CategoryTree,
} from '../models/category-node';

@Component({
  selector: 'dr-category-assign-dialog',
  templateUrl: './category-assign-dialog.component.html',
  styleUrls: ['./category-assign-dialog.component.scss'],
})
export class CategoryAssignDialogComponent extends CategoryTreeBase
  implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  categories = Array<CategoryTree>();

  /** A selected parent node to be inserted */
  selectedParent: CategoryFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  /** The selection for checklist */
  checklistSelection = new SelectionModel<CategoryFlatNode>(
    true /* multiple */,
  );

  constructor(
    private service: CategoryService,
    private toastService: NotificationsService,
    private entityApi: CategoryEntityApiService,
    public dialogRef: MatDialogRef<CategoryAssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      fileInfo: BrowserDataItem;
      assignedCategories: CategoryNode[];
    },
  ) {
    super();
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(
      this.getLevel,
      this.isExpandable,
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    );

    service.activeTree$.subscribe(tree => {
      this.dataSource.data = tree;
    });
  }

  ngOnInit(): void {
    this.dataSource.data = this.data.assignedCategories;
    this.service.activeTree$.subscribe(tree => (this.dataSource.data = tree));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  checkAssignedTags(): void {
    const assignedTags = this.treeControl.dataNodes.filter(flatNode =>
      this.dataSource.data.some(node => node.id === flatNode.id),
    );

    
    assignedTags.forEach(flatNode => {
      // this.descendantsAllSelected(flatNode)
      //   ? this.categoryLeafNodeSelectionToggle(flatNode)
      //   : this.categoryNodeSelectionToggle(flatNode);
    });
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child),
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child),
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  categoryNodeSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  categoryLeafNodeSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: CategoryFlatNode): void {
    let parent: CategoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: CategoryFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child),
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }
  /** Assign selected `CategoryNode` list to the entity */
  save(): void {
    const nodeIDList: string[] = this.checklistSelection.selected.map(
      flatNode => this.flatNodeMap.get(flatNode).id,
    );
    this.entityApi
      .addTags(this.data.fileInfo.id, nodeIDList)
      .subscribe(
        () => null,
        error =>
          this.toastService.showToastNotification(
            new NotificationItem(
              null,
              NotificationMessage.CreateCommonMessage(
                NotificationType.Error,
                'File Update',
                'Failed to assign categories to the file',
              ),
            ),
            false,
          ),
        () =>
          this.toastService.showToastNotification(
            new NotificationItem(
              null,
              NotificationMessage.CreateCommonMessage(
                NotificationType.Info,
                'File Update',
                'Categories have been succefully assigned to the file',
              ),
            ),
            false,
          ),
      );
  }

  /** Close dialog */
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
