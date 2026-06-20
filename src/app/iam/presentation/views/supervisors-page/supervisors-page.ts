import { Component, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { IamStore } from '../../../application/iam.store';
import { SupervisorDirectory } from '../../components/supervisor-directory/supervisor-directory';
import { SupervisorForm } from '../../components/supervisor-form/supervisor-form';

@Component({
  selector: 'app-supervisors-page',
  standalone: true,
  imports: [SupervisorDirectory, MatButtonModule, MatIconModule],
  templateUrl: './supervisors-page.html',
  styleUrl: './supervisors-page.css',
})
export class SupervisorsPage implements OnInit {
  private store = inject(IamStore);
  private dialog = inject(MatDialog);

  readonly supervisors = this.store.supervisors;
  readonly supervisorCount = computed(() => this.supervisors().length);

  ngOnInit(): void {
    this.store.loadSupervisors();
  }

  openCreateDialog(): void {
    this.dialog.open(SupervisorForm, {
      width: '480px',
      maxWidth: '96vw',
      panelClass: 'mg-dialog-panel',
      disableClose: false,
    });
  }
}
