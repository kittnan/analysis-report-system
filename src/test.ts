// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/plugins/long-stack-trace-zone';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
// Since CLI 15 the karma builder appends the spec files to this entry and starts Karma itself.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } }
);
