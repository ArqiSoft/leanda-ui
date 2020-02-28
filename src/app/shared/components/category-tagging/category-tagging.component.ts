import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
} from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { CategoryStorageService } from '../../../core/services/category/category-storage.service';
import { CategoryFlatNode } from '../categories-tree/models/category-node';

@Component({
  selector: 'dr-category-tagging',
  templateUrl: './category-tagging.component.html',
  styleUrls: ['./category-tagging.component.scss'],
})  
export class CategoryTaggingComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  categoryControl = new FormControl();
  selectedCategories: CategoryFlatNode[] = [];
  allCategories: CategoryFlatNode[] = [];
  filteredCategories: Observable<CategoryFlatNode[]>;

  @ViewChild('categoryInput', { static: false }) categoryInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private categoriesService: CategoryStorageService) {
    this.allCategories = this.categoriesService.flatTreeNodes;
    this.filteredCategories = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map((categoryTitle: string | null) =>
        categoryTitle ? this._filter(categoryTitle) : this.allCategories,
      ),
    );
  }

  ngOnInit(): void {
    // this.categoriesService.nestedNodeMap.get()
  }

  add(event: MatChipInputEvent): void {
    // Add category only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    this.allCategories = this.allCategories.filter(c => this.selectedCategories.indexOf(c) !== 0 );

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // this.categoriesService
      // Add our category
      if (value) {
        // this.selectedCategories.push(value.trim);
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.categoryControl.setValue(null);
    }
  }

  remove(category: CategoryFlatNode): void {
    const index = this.selectedCategories.indexOf(category);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategories.push(event.option.value);
    this.categoryInput.nativeElement.value = '';
    this.categoryControl.setValue(null);
  }

  private _filter(title: string): CategoryFlatNode[] {
    return this.categoriesService.flatTreeNodes.filter(
      category => category.title.indexOf(title) === 0,
    );
  }
}
