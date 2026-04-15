// IMPORTANTE: zone.js/testing DEVE ser o primeiro import
// para que o monkey-patch da ProxyZone aconteca antes
// que o Vitest registre qualquer hook global (beforeEach/afterEach)
import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// destroyAfterEach: false evita que o Angular chame
// resetFakeAsyncZone() no afterEach global do Vitest
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } },
);
