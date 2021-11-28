CREATE ROLE "user" LOGIN PASSWORD 'password';

CREATE DATABASE "db_dapp_docs_registry"
    WITH
    OWNER = "user"
    ENCODING = "UTF8"
    CONNECTION LIMIT = -1;

GRANT ALL PRIVILEGES ON DATABASE "db_dapp_docs_registry" TO "user";

