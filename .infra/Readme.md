## NFT Oracles Registry

### Installation

1. Build docker images

```
  cd .infra && build all 
```

2. Deploy Postgres database (if it needs)

2.1
```
  cd .infra && start db
```
2.2 Create scheme (e.g. nft_oracle_database)
  See .infra/postgres-database/init-data

2.3 Run migrations
  
  2.3.1 Configure .env file for backend application (copy from .env.example and set up)
  ```
    cp src/backend/.env.example src/backend/.env
  ``` 
  
  2.3.2 Run migrations in docker container
  ```
    cd .infra && start migrations
  ``` 

3. Start local test blockchain (if it needs)

  3.1 Configure .env file for blockchain containers (copy from .env.example and set up)
```
  cp src/blockchain/.env.example src/blockchain/.env
```
  
  3.2 Start blockchain node and container for Contract deploing
```
  cd .infra && start blockchain
```

4. Deploy Solidity contract 

```
   CONTRACT_DEPLOY_CONTAINER_ID=$(docker ps --all | grep nft-oracle-contract-deploy | awk '{print $1}')
   docker run -it ${CONTRACT_DEPLOY_CONTAINER_ID} 'yarn contract:deploy'
```
5. Store CONTRACT_ADDRESS and add it to src/backend/.env

6. Configure .env file for frontend application (copy from .env.example and set up)
  ```
    cp src/frontend/.env.example src/backend/.env
  ``` 
7. Start application (backend and frontend)
  ```
     cd .infra && start app
  ```
