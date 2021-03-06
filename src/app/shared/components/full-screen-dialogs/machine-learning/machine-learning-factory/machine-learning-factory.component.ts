import { Component, ComponentFactoryResolver, Input, ReflectiveInjector, ViewChild, ViewContainerRef } from '@angular/core';


@Component({
  selector: 'dr-machine-learning-factory',
  templateUrl: './machine-learning-factory.component.html',
  styleUrls: ['./machine-learning-factory.component.scss'],
})
export class MachineLearningFactoryComponent {

  currentComponent = null;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true }) dynamicComponentContainer: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {}

  @Input() set componentData(data: { component: any, inputs: any }) {
    if (!data) {
      return;
    }
    const inputProviders = Object.keys(data.inputs).map((inputName) => {
      return { provide: inputName, useValue: data.inputs[inputName] };
    });
    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);
    const factory = this.resolver.resolveComponentFactory(data.component);
    const component = factory.create(injector);
    this.dynamicComponentContainer.insert(component.hostView);

    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = component;
  }
}
