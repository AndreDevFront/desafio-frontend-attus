import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/usuarios/feature-usuarios/usuarios-page.component').then(
        (m) => m.UsuariosPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
