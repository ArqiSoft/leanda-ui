import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material';
import { CategoryEntityApiService } from 'app/core/services/api/category-entity-api.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Subject } from 'rxjs';

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

  /** The selection for checklist */
  checklistSelection = new SelectionModel<CategoryFlatNode>(
    true /* multiple */,
  );

  constructor(
    private toastService: NotificationsService,
    private entityApi: CategoryEntityApiService,
    public dialogRef: MatDialogRef<CategoryAssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      fileInfo: BrowserDataItem;
      assignedCategories: CategoryFlatNode[];
      selectedCategories: CategoryFlatNode[];
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
    this.dataSource.data = this.data.assignedCategories as CategoryNode[];
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  disableSave(): boolean {
    const assignedTags = this.treeFlattener.flattenNodes(this.data.selectedCategories);
    const unAssignedCategories = this.treeFlattener.flattenNodes(this.data.assignedCategories).filter(scNode => !assignedTags.includes(scNode));
    const nodeIDList: string[] = this.checklistSelection.selected.map(flatNode => this.flatNodeMap.get(flatNode).id);
    return unAssignedCategories.filter(unNode => nodeIDList.includes(unNode.id)).length === 0;
  }

  checkHasBeenAssigned(node: CategoryFlatNode): boolean {
    return this.data.selectedCategories.some(scNode => scNode.id === node.id);
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
    if (!this.checkHasBeenAssigned(node)) {
      this.checklistSelection.toggle(node);
    }
    const descendants = this.treeControl.getDescendants(node);
    // Selects all child when parent is selected

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  categoryLeafNodeSelectionToggle(node: CategoryFlatNode): void {
    if (!this.checkHasBeenAssigned(node)) {
      this.checklistSelection.toggle(node);
    }
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: CategoryFlatNode): void {
    let parent: CategoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      parent = this.getParentNode(parent);
    }
  }

  getCategoryFullPath(node: CategoryFlatNode): string {
    const path: string[] = [];
    let parent: CategoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      if (parent !== null) {
        path.push(parent.title);
      }
      parent = this.getParentNode(parent);
      if (parent === null) {
        path.push(node.title);
      }
    }
    const fullPath = `${path.join(' / ')}`;

    return fullPath;
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
