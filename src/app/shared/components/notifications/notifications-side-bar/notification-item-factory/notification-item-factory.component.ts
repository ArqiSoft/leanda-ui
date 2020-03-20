import { Component, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { INotificationComponent, NotificationItem, NotificationMessage } from '../../notifications.model';

@Component({
  selector: 'dr-notification-items-factory',
  templateUrl: './notification-item-factory.component.html',
  styleUrls: ['./notification-item-factory.component.scss'],
})
export class NotificationItemFactoryComponent implements OnInit, OnDestroy {

  private eventSubscription: Subscription;
  @ViewChild('notificationComponentContainer', { read: ViewContainerRef, static: true }) _container: ViewContainerRef;
  @Input()
  set componentData(value: NotificationItem) {
    if (!value) {
      return;
    }

    const cmpFactory = this._resolver.resolveComponentFactory(value.component);
    const component: ComponentRef<INotificationComponent> =
      this._container.createComponent(cmpFactory) as ComponentRef<INotificationComponent>;

    component.instance.notificationItem = value;
    this.eventSubscription = component.instance.closeEvent.subscribe(
      (item: NotificationMessage) => {
        value.closeEvent(item);
      },
    );
  }

  constructor(private _resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
