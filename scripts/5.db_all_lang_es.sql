--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 506, 'Negocio');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 506, 'Comunicaciones');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 506, 'Educación');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 506, 'Finanzas');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 506, 'Casa & home');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 506, 'Productividad');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 506, 'Compras');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 506, 'Juego');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20100','Nombre de usuario 5 - 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20101','Nombre de usuario no válido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20102','Bio max 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20103','Correo electrónico max 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20104','Recordatorio max 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20105','Correo electrónico no válido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20106','Contraseña 10 - 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20107','Se requiere nombre de usuario, contraseña y correo electrónico');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20200','Correo electrónico ya existe');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20201','Provider ya existe');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20203','Usuario ya existe');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20204','Demasiado largo');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20300','Usuario o contraseña no encontrado');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20301','Contraseña no es la misma');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20302','No puede eliminar la última configuración de usuario');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20303','Por favor ingrese nombre de usuario');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20304','Por favor ingrese contraseña');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20305','Usuario no encontrado');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20306','Código no válido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20307','Tipo de archivo no permitido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20308','Tamaño de archivo demasiado grande');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20309','Texto no válido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20310','Texto demasiado largo');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20400','Registro no encontrado');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (506,'20401','Contraseña inválida');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Público','0',506);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privado compartido','1',506);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privado','2',506);
