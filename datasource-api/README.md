To run the docker container:

```
$ docker build . -t datasource-api
```

```
$ docker run -d --name datasource-api -p 3001:3001 -e DB_HOST -e DB_USER -e DB_PASSWORD -e DB_NAME datasource-api:latest
```
