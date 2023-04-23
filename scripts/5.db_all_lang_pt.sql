--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 436, 'O negócio');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 436, 'Comunicações');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 436, 'Educação');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 436, 'Finança');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 436, 'Casa Lar');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 436, 'Produtividade');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 436, 'Compras');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 436, 'Jogo');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20100','Nome de usuário 5 - 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20101','Nome de usuário inválido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20102','Bio max 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20103','E-mail máximo de 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20104','Lembrete máximo de 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20105','E-mail inválido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20106','Senha 10 - 100 caracteres');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20107','Nome de usuário, senha e e-mail são obrigatórios');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20200','Email já existe');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20201','O provedor já existe');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20203','Nome de usuário existente');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20204','Valor muito longo');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20300','Nome de usuário ou senha não encontrado');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20301','Senha não é a mesma');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20302','Você não pode excluir a última configuração do usuário');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20303','Por favor, digite o nome de usuário');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20304','Por favor, digite a senha');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20305','Usuário não encontrado');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20306','Código inválido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20307','Tipo de arquivo não permitido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20308','Tamanho do arquivo muito grande');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20309','Texto inválido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20310','Texto muito longo');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20400','Registro não encontrado');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20401','Senha inválida');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (436,'20500','Latitude ou longitude ausentes');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Público','0',436);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privado compartilhado','1',436);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privado','2',436);
