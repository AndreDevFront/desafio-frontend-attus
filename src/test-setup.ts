import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// teardown: destroyAfterEach: false evita que o TestBed chame
// resetFakeAsyncZone() no afterEach global do Vitest, que quebra
// a ProxyZone do Zone.js (incompatibilidade conhecida entre
// TestBed.teardown e Vitest com Zone.js)
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } },
);
