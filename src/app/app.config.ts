import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { usuariosReducer } from './features/usuarios/data-access/store/usuarios.reducer';
import { UsuariosEffects } from './features/usuarios/data-access/store/usuarios.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore({ usuarios: usuariosReducer }),
    provideEffects([UsuariosEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
