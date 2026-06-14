import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';

import { Route } from '../../../domain/model/route.entity';
import { RouteStatus } from '../../../domain/model/route-status';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-route-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TitleCasePipe, TranslatePipe],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.css',
})
export class RouteCard {
  @Input({ required: true }) route!: Route;
  @Input() selected = false;

  @Output() select = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{ id: string; status: RouteStatus }>();
  @Output() delete = new EventEmitter<string>();
}
