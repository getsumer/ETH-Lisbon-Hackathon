# Grafan4W3b3

### Building and deploying dockerized AAVE Interface

```
$ docker build . -t aave-interface
$ docker run -d --name aave-interface -p 3002:3002 aave-interface:latest
```

### Building and deploying dockerized Datasource API

```
$ docker build . -t datasource-api
$ docker run -d --name datasource-api -p 3001:3001 -e DB_HOST -e DB_USER -e DB_PASSWORD -e DB_NAME -e MONGO_DB datasource-api:latest
```

# Team members

1. Damian Izarnotegui
2. Mario Maita Orozco
3. Carlos Barceló
4. Isaac Herrera