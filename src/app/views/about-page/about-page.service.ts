import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';
import { Component, Injectable } from "@angular/core";

@Injectable()
export class AboutPageService {
  private _selectedPortal: BehaviorSubject<Portal<Component>> = new BehaviorSubject(null);
  public get selectedPortal(): Portal<Component> {
    return this._selectedPortal.value;
  }
  public set selectedPortal(value: Portal<Component>) {
    this._selectedPortal.next(value);
  }

  private _componentPortal: BehaviorSubject<ComponentPortal<Component>> = new BehaviorSubject(null);
  public set componentPortal(value: ComponentPortal<Component>) {
    this._componentPortal.next(value);
  }
}
