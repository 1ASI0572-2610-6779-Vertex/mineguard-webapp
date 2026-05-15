import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AdminNotice } from '../../../domain/model/admin-notice.entity';

/**
 * "Avisos Administrativos Pendientes" panel for the admin control panel.
 */
@Component({
  selector: 'app-admin-notices',
  standalone: true,
  imports: [MatIcon, TranslatePipe],
  templateUrl: './admin-notices.html',
  styleUrl: './admin-notices.css',
})
export class AdminNotices {
  @Input({ required: true }) notices: AdminNotice[] = [];
}
