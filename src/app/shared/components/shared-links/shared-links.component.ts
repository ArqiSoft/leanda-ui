import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { SignalrService } from 'app/core/services/signalr/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dr-shared-links',
  templateUrl: './shared-links.component.html',
  styleUrls: ['./shared-links.component.scss'],
})
export class SharedLinksComponent implements OnInit {

  private dom: Document;
  public publicLink: string;
  public isShared = false;

  constructor(
    public entitiesApi: EntitiesApiService,
    public dialogRef: MatDialogRef<SharedLinksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) dom: Document,
  ) {
    this.dom = dom;
    this.getSharedStatus();
  }

  ngOnInit() {
    if (location.pathname.toLowerCase().startsWith('/file')) {
      this.publicLink = location.origin + '/file/' + this.data.fileInfo.id;
    } else if (location.pathname.toLowerCase().startsWith('/record')) {
      this.publicLink = location.origin + '/record/' + this.data.fileInfo.id;
    } else if (location.pathname.toLowerCase().startsWith('/model')) {
      this.publicLink = location.origin + '/model/' + this.data.fileInfo.id;
    } else {
      this.publicLink = location.origin + this.data.fileInfo.link;
    }
  }

  getSharedStatus() {
    const item = this.data.fileInfo;
    if (item.accessPermissions && item.accessPermissions.isPublic) {
      return this.isShared = item.accessPermissions.isPublic;
    } else {
      return this.isShared = false;
    }
  }

  copyToClipboard(el: { select: () => void; }): void {
    el.select();
    this.dom.execCommand('copy');
  }

  togglePublicLink() {
    this.entitiesApi.patchEntityPublicLink(this.data.fileInfo, this.isShared = !this.isShared);
  }
}
