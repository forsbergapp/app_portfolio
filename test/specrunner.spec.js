/**
 * Specifies files in given order
 * for Jasmine test framework
 * Tests Critical success factor (CSF) part of project
 * @module test/specrunner.spec
 */

/**
 * Spy test, commonApp as called from bff 
 *  should call fileModelAppSecret.get and read APP_SECRET and IAM_APP_TOKEN at least 1 time each when requesting app
 */
import '../apps/common/src/common.spec.js';

/**
 * Unit test, dbSQLParamConvert 
 *  should return converted sql and parameters in correct format for the database used for SELECT, INSERT, DELETE and UPDATE sql
 */
import '../server/db/db.spec.js';

/**
 * Integration test, setting FILE_DB cache
 *  should return values when using ORM pattern for fileModelConfig
 * Integration test, microservice geolocation IP cache (should exist before test) called from BFF and from all apps
 *  should return values
 * Integration test, microservice worldcities random city called from BFF and from all apps
 *  should return values 
 */
import './integration.spec.js';

/**
 * Performance test
 */
import './performance.spec.js';