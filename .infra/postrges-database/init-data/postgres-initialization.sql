CREATE ROLE "user" LOGIN PASSWORD 'password';

CREATE DATABASE "nft_oracle_database"
    WITH
    OWNER = "user"
    ENCODING = "UTF8"
    CONNECTION LIMIT = -1;

GRANT ALL PRIVILEGES ON DATABASE "nft_oracle_database" TO "user";

