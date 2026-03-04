import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'expedientes',
    pathMatch: 'full',
  },
  {
    path: 'expedientes/:id',
    loadComponent: () =>
      import('./expediente/expediente-shell.component').then(
        (m) => m.ExpedienteShellComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'expedientes',
  },
];
