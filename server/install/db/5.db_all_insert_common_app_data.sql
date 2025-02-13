--
-- app
--
INSERT INTO <DB_SCHEMA/>.app (id) VALUES (<APP_ID/>);

--
-- app_data_entity
--
INSERT INTO <DB_SCHEMA/>.app_data_entity (id, app_id, json_data) VALUES (1, <APP_ID/>, '{"description":"Entity info: Common", "name":"COMMON"}');

--
-- app_data_entity_resource
--
INSERT INTO <DB_SCHEMA/>.app_data_entity_resource (id, app_data_entity_app_id, app_data_entity_id, app_setting_id, json_data) VALUES (0, <APP_ID/>, 1, 36, '{"description":"Log"}');
INSERT INTO <DB_SCHEMA/>.app_data_entity_resource (id, app_data_entity_app_id, app_data_entity_id, app_setting_id, json_data) VALUES (1, <APP_ID/>, 1, 37, '{"description":"Profile search"}');