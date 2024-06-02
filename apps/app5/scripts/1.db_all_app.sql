-- COMMON
--
-- app
--
INSERT INTO <DB_SCHEMA/>.app (id, app_category_id) VALUES (<APP_ID/>, 1);
--
-- app setting type
--
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('CUSTOMER_TYPE', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('TRANSACTION_TYPE', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('BANK_TYPE', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('MERCHANT_TYPE', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('ENTITY_TYPE', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('RESOURCE_TYPE', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('STATUS', <APP_ID/>);
--
-- app setting with display data only
--
--settings used as relation
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'RESOURCE_TYPE','PAYMENT','Payment',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'RESOURCE_TYPE','CUSTOMER','Customer',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'RESOURCE_TYPE','MERCHANT','Merchant',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'RESOURCE_TYPE','ACCOUNT','Account',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'RESOURCE_TYPE','TRANSACTION','Transaction',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'RESOURCE_TYPE','PRODUCT','Product',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'RESOURCE_TYPE','SERVICE','Service',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'RESOURCE_TYPE','PAGE','Page',NULL,NULL,NULL,NULL);
--settings used as attributes
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'ENTITY_TYPE','BANK','Bank',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'ENTITY_TYPE','CENTRALBANK','Central bank',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'ENTITY_TYPE','SETTLEMENT_SERVICE','Settlement service',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','PERSONAL_SINGLE', 'Personal - single',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','PERSONAL_JOINT', 'Personal - joint',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','PERSONAL_ILLITERATE', 'Personal - illiterate',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','PERSONAL_BLIND', 'Personal - blind',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','PERSONAL_MINOR', 'Personal - minor',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_SOLE', 'Business - sole',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_LIMITED', 'Business - limited',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_COMPANY_PRIVATE', 'Business - company private',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_COMPANY_PUBLIC', 'Business - company public',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_COMPANY_GOVERNMENT', 'Business - company government',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_COMPANY_ONE', 'Business - company one person',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_COMPANY_FOREIGN', 'Business - company foreign',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_COMPANY_HOLDING', 'Business - company holding',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','BUSINESS_COMPANY_SUBSIDIARY', 'Business - company subsidiary',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','PARTNERSHIP', 'Partnership',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','TRUST_PUBLIC', 'Trust public',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','TRUST_PRIVATE', 'Trust private',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'CUSTOMER_TYPE','CLUB_SOCIETY', 'Club & society - non profit',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'BANK_TYPE','ABA','ABA type',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'BANK_TYPE','SEPA','SEPA type',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'MERCHANT_TYPE','WHOLESALE','Wholesale',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'MERCHANT_TYPE','RETAIL','Retail',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'MERCHANT_TYPE','ECOMMERCE','eCommerce',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'MERCHANT_TYPE','AFFILIATE','Affiliate',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','ELECTRONIC_CHECKS','Electronic check',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','DIRECT_DEPOSIT','Direct deposit',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','PHONE_PAYMENT','Phone payment',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','ATM','ATM',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','CARD','Card',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','INTERNET','Internet',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','WITHDRAWAL','Withdrawal',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','FEE','Fee',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TRANSACTION_TYPE','INTEREST','Interest',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'STATUS','ONLINE','Online',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'STATUS','OFFLINE','Offline',NULL,NULL,NULL,NULL);

--
-- app data entity
--
INSERT INTO <DB_SCHEMA/>.app_data_entity (app_id, json_data) VALUES (<APP_ID/>, '{"description":"Entity info: Swedish bank using SEPA, IBAN, VPA","name":"App Bank", "country_code":"SE", "bank_id":1234, "bban_length":16, "bank_type":"SEPA", "entity_type":"BANK"}');
--
-- app data entity resource
--
INSERT INTO <DB_SCHEMA/>.app_data_entity_resource (json_data, app_setting_id, app_data_entity_app_id, app_data_entity_id) 
    VALUES ('{  "description":"Account info: Accounts using one currency",
                "currency":"€", 
                "currency_name":"App Euro",
                "data":{
						"title":	            {"value":null, "metadata":{"default_text":"Account",                      "length":null,"type": "TEXT",     "contentEditable":false}},
						"bank_account_number":  {"value":null, "metadata":{"default_text":"Number",                       "length":16,  "type": "TEXT",     "contentEditable":false}},  "comment":"Generate number with Date.now().toString().padStart(16,''0'')"},
						"bank_account_secret": 	{"value":null, "metadata":{"default_text":"Secret", 		              "length":64,  "type": "TEXT", 	"contentEditable":false}},  "comment":"SHA256"},
						"bank_account_vpa":		{"value":null, "metadata":{"default_text":"Virtual Payment Address (VPA)","length":36,  "type": "TEXT",     "contentEditable":false}},  "comment":"UUID format [8characters]-[4characters]-[4characters]-[4characters]-[12characters]"}
				}}', 
            (SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_id = <APP_ID/> AND app_setting_type_app_setting_type_name='RESOURCE_TYPE' AND value = 'ACCOUNT'), 
            <APP_ID/>, 
            (SELECT id FROM <DB_SCHEMA/>.app_data_entity WHERE app_id = <APP_ID/>));
INSERT INTO <DB_SCHEMA/>.app_data_entity_resource (json_data, app_setting_id, app_data_entity_app_id, app_data_entity_id) 
    VALUES ('{"description":"Payment info: Payments using VPA (Virtual Payment Address) and UUID random generated id to make payments", "payment_wait":180, "vpa_validity":1, "status":"ONLINE"}', 
            (SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_id = <APP_ID/> AND app_setting_type_app_setting_type_name='RESOURCE_TYPE' AND value = 'PAYMENT'), 
            <APP_ID/>, 
            (SELECT id FROM <DB_SCHEMA/>.app_data_entity WHERE app_id = <APP_ID/>));
INSERT INTO <DB_SCHEMA/>.app_data_entity_resource (json_data, app_setting_id, app_data_entity_app_id, app_data_entity_id) 
    VALUES ('{  "description":"Customer info: Customers", 
                "data":{
						"title":	    {"value":null, "metadata":{"default_text":"Enter customer info to create new bank account", "length":null, "type": "TEXT", "contentEditable":false}},
						"customer_type":{"value":null, "metadata":{"default_text":"Customer type", 	"length":100, "type": "SELECT", "contentEditable":true}, "comment": "APP_SETTING.app_setting_type_app_setting_type_name=CUSTOMER_TYPE"},
						"name": 		{"value":null, "metadata":{"default_text":"Name", 			"length":100, "type": "TEXT", 	"contentEditable":true}},
						"address":		{"value":null, "metadata":{"default_text":"Address", 		"length":100, "type": "TEXT", 	"contentEditable":true}},
						"city":			{"value":null, "metadata":{"default_text":"City", 			"length":100, "type": "TEXT", 	"contentEditable":true}},
						"country":		{"value":null, "metadata":{"default_text":"Country", 		"length":2,   "type": "SELECT", "contentEditable":true}, "comment": "lowercase COUNTRY.countrycode"}
				},
                "status":"ONLINE"}', 
            (SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_id = <APP_ID/> AND app_setting_type_app_setting_type_name='RESOURCE_TYPE' AND value = 'CUSTOMER'), 
            <APP_ID/>, 
            (SELECT id FROM <DB_SCHEMA/>.app_data_entity WHERE app_id = <APP_ID/>));
INSERT INTO <DB_SCHEMA/>.app_data_entity_resource (json_data, app_setting_id, app_data_entity_app_id, app_data_entity_id) 
    VALUES ('{"description":"Merchant info: Merchants ...", "status":"ONLINE"}', 
            (SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_id = <APP_ID/> AND app_setting_type_app_setting_type_name='RESOURCE_TYPE' AND value = 'MERCHANT'), 
            <APP_ID/>, 
            (SELECT id FROM <DB_SCHEMA/>.app_data_entity WHERE app_id = <APP_ID/>));
--
-- app data resource master
--
INSERT INTO <DB_SCHEMA/>.app_data_resource_master (json_data, user_account_app_user_account_id, user_account_app_app_id, app_data_entity_resource_app_data_entity_app_id, app_data_entity_resource_app_data_entity_id, app_data_entity_resource_id) 
    VALUES ( '{"description":"Merchant demo", "country_code":"SE", "merchant_type":"ECOMMERCE", "authorization_key":1234, "url":"app5.localhost", "status":"ONLINE"}', null, null, <APP_ID/>,
            (SELECT id 
               FROM <DB_SCHEMA/>.app_data_entity 
              WHERE app_id = <APP_ID/>), 
            (SELECT ader.id 
               FROM <DB_SCHEMA/>.app_data_entity_resource ader, 
                    <DB_SCHEMA/>.app_data_entity ade, 
                    <DB_SCHEMA/>.app_setting ap_s 
              WHERE ade.app_id = <APP_ID/> 
                AND ader.app_data_entity_app_id = ade.app_id 
                AND ader.app_data_entity_id = ade.id 
                AND ader.app_setting_id =  ap_s.id 
                AND ap_s.app_setting_type_app_id = ader.app_data_entity_app_id 
                AND ap_s.app_setting_type_app_setting_type_name='RESOURCE_TYPE' 
                AND ap_s.value = 'MERCHANT'));