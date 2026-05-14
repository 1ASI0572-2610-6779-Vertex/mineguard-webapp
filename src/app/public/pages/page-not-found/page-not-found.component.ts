import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
  requestedRoute: string;

  constructor(private router: Router) {
    // Aquí puedes obtener la ruta no encontrada de alguna manera
    this.requestedRoute = this.router.url; // Esto asume que la URL es la ruta no encontrada
  }

  goHome() {
    this.router.navigate(['/']); // Redirige a la página principal
  }
}
