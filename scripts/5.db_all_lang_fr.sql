--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 166, 'Entreprise');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 166, 'Communications');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 166, 'Éducation');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 166, 'Finance');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 166, 'Maison & Foyer');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 166, 'Productivité');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 166, 'Achats');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 166, 'Jeu');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20100','Nom d''utilisateur 5 - 100 caractères');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20101','Nom d''utilisateur non valide');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20102','Bio max 100 caractères');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20103','E-mail max 100 caractères');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20104','Rappel max 100 caractères');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20105','E-mail non valide');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20106','Mot de passe 10 - 100 caractères');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20107','Nom d''utilisateur, mot de passe et email sont requis');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20200','L''e-mail existe déjà');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20201','Le fournisseur existe déjà');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20203','Nom d''utilisateur existe déjà');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20204','Valeur trop longue');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20300','Nom d''utilisateur ou mot de passe introuvable');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20301','Le mot de passe n''est pas le même');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20302','Vous ne pouvez pas supprimer le dernier paramètre utilisateur');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20303','Veuillez entrer le nom d''utilisateur');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20304','Veuillez entrer le mot de passe');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20305','Utilisateur non trouvé');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20306','Code non valide');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20307','Type de fichier non autorisé');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20308','Taille de fichier trop grande');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20309','Texte non valide');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20310','Texte trop long');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20400','Enregistrement non trouvé');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20401','Mot de passe incorrect');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (166,'20500','Latitude ou longitude manquante');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Public','0',166);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privé partagé','1',166);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privé','2',166);
