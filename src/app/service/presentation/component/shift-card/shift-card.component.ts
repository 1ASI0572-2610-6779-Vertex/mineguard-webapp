import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Shift } from '../../../domain/model/shift.entity';

@Component({
  selector: 'app-shift-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './shift-card.component.html',
  styleUrl: './shift-card.component.css',
})
export class ShiftCard {
  @Input({ required: true }) shift!: Shift;
}
