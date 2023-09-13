-- COMMON
--
-- app
--
INSERT INTO app_portfolio.app (id, app_name, url, logo, enabled, app_category_id) VALUES (4,'Maps','https://app4.localhost','/app4/images/logo.png', 1, 1);
--
-- app_object
--
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (4,'APP_DESCRIPTION');
--
-- app_parameter
--
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (4,'1','APP_COPYRIGHT','{COPYRIGHT TEXT}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (4,'2','SERVICE_DB_APP_USER','app4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (4,'2','SERVICE_DB_APP_PASSWORD','<APP_PASSWORD/>',NULL);
