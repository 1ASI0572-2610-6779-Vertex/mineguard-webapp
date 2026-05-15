import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';
import { SupervisorDirectory } from '../../components/supervisor-directory/supervisor-directory';
import { SupervisorForm } from '../../components/supervisor-form/supervisor-form';

/**
 * Admin "Gestión de Usuarios" view ({@link administrador2.png} wireframe).
 *
 * @remarks
 * Composes the new-supervisor form (left card) and the supervisor directory
 * (right panel). Loads the supervisor list on initialization through the
 * {@link IamStore}.
 */
@Component({
  selector: 'app-supervisors-page',
  standalone: true,
  imports: [SupervisorForm, SupervisorDirectory, TranslatePipe],
  templateUrl: './supervisors-page.html',
  styleUrl: './supervisors-page.css',
})
export class SupervisorsPage implements OnInit {
  private store = inject(IamStore);

  readonly supervisors = this.store.supervisors;

  ngOnInit(): void {
    this.store.loadSupervisors();
  }
}
