-- COMMON
--
-- app
--
INSERT INTO app_portfolio.app (id, enabled, app_category_id) VALUES (4, 1, 1);
--
-- app_parameter
--
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (4,'1','APP_COPYRIGHT','{COPYRIGHT TEXT}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (4,'2','SERVICE_DB_APP_USER','app4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (4,'2','SERVICE_DB_APP_PASSWORD','<APP_PASSWORD/>',NULL);
