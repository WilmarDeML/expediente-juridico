import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'expedientes/d06b0ba2-5c70-49ba-a642-ba48258df3c3',
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
    path: 'health',
    loadComponent: () =>
      import('./health/health.component').then(
        (m) => m.HealthComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'expedientes/d06b0ba2-5c70-49ba-a642-ba48258df3c3',
  },
];
