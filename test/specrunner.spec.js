/**
 * Specifies files in given order
 * for Jasmine test framework
 * Tests Critical success factor (CSF) part of project
 * Jasmine is the chosen framework in this project and has almost identical syntax for basic testing needed as Jest including 
 * async, describe, it, expect, beforeAll and afterAll functions but Jasmine contains less devDependencies and complies more with directives.
 * Jasmine also supports specrunner using syntax below so tests can be performed in sequential order.
 * Snap shot test, acceptance test and UI/browser tests are out of scope in this project.
 * 
 * Test order           Path
 * 1.Spy test           /apps/common/src/common.spec.js
 * 2.Integration test   /test/integration.spec.js
 * 3.Performance test   /test/performance.spec.js
 * 
 * @module test/specrunner.spec
 */

/**
 * Spy test, commonApp as called from bff 
 *  should call AppSecret.get and read APP_SECRET and IAM_APP_ID_TOKEN at least 1 time each when requesting app
 */
import '../apps/common/src/common.spec.js';

/**
 * Integration test, setting FILE_DB cache
 *  should return values when using ORM pattern for Config
 * Integration test, microservice geolocation IP cache (should exist before test) called from BFF and from all apps
 *  should return values
 * Integration test, server function worldcities random city called from BFF and from all apps
 *  should return values 
 */
import './integration.spec.js';

/**
 * Performance test
 */
import './performance.spec.js';