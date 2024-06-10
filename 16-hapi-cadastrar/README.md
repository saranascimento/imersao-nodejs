## Run Postgres Docker

```sh
docker run \
   --name postgres \
   -e POSTGRES_USER=user \
   -e POSTGRES_PASSWORD=senha \
   -e POSTGRES_DB=heros \
   -p 5432:5432 \
   -d \
   postgres
```

```sh
docker ps
```

## Execute bash inside the container

```sh
docker exec -it postgres /bin/bash

```

## Execute adminer

```sh
docker run \
  --name adminer \
  -p 8080:8080 \
  --link postgres:postgres \
  -d \
  adminer
```

## Run MongoDB docker

```sh
docker run \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=senha \
  -d \
  mongo:4
```

## Client MongoFB

```sh
docker run \
 --name mongoclient \
  -p 3000:3000 \
  --link mongodb:mongodb \
  -d \
  mongoclient/mongoclient
```

## Create User MongoDB

```sh
  docker exec -it mongodb \
  mongo --host localhost -u admin -p senha --authenticationDatabase admin \
  --eval "db.getSiblingDB('herois').createUser({user: 'user', pwd: 'senha', roles: [{role: 'readWrite', db: 'herois'}]})"
  ```