GRANT role_app_common TO role_app2
GRANT role_app2 TO app2;
SET DEFAULT ROLE role_app_admin FOR app_admin;
SET DEFAULT ROLE role_app_dba FOR app_portfolio;
SET DEFAULT ROLE role_app_common FOR app1;
SET DEFAULT ROLE role_app2 FOR app2;
SET DEFAULT ROLE role_app_common FOR app3;