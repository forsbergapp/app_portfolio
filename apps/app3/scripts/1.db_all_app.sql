-- COMMON
--
-- app
--
INSERT INTO app_portfolio.app (id, app_category_id) VALUES (<APP_ID/>, 1);
--
-- app_parameter
--
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (<APP_ID/>,'1','APP_COPYRIGHT','{COPYRIGHT TEXT}',NULL);