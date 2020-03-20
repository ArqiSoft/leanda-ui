import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'dr-properties-info-box',
  templateUrl: './properties-info-box.component.html',
  styleUrls: ['./properties-info-box.component.scss'],
})
export class PropertiesInfoBoxComponent {
  @ViewChild(MatExpansionPanel) panel: { expanded: boolean };

  @Input() meta: any;
  @Input() expansionEnabled = true;
  @Input() data: any;
  @Input() isPublic = false;
  /*   @Input() icon;
    @Input() title;
    @Input() properties; */
  @Output() edit = new EventEmitter<any>();
  maxPropNameElWidth = 300; // px

  onEditClick(e: { preventDefault: () => void; stopPropagation: () => void }) {
    e.preventDefault();
    e.stopPropagation();
    this.edit.emit(null);
  }

  expand() {
    this.panel.expanded = true;
  }
}