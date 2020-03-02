import { Component, ComponentFactoryResolver, EventEmitter, Injector, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'dr-organize-info-box-factory',
  templateUrl: './organize-info-box-factory.component.html',
  styleUrls: ['./organize-info-box-factory.component.scss'],
})
export class OrganizeInfoBoxFactoryComponent {
  currentComponent = null;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true }) dynamicComponentContainer: ViewContainerRef;

  @Input() set componentData(data: { component: any; inputs: any }) {
    if (!data) {
      return;
    }

    const inputProviders = Object.keys(data.inputs).map(inputName => ({ provide: inputName, useValue: data.inputs[inputName] }));

    const injector = Injector.create({ providers: inputProviders, parent: this.dynamicComponentContainer.injector });

    const factory = this.resolver.resolveComponentFactory(data.component);

    const component = factory.create(injector);

    this.dynamicComponentContainer.insert(component.hostView);

    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = component;
  }

  @Output() editClick = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver) {}
}
