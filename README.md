### Building and deploying dockerized AAVE Interface

```
$ docker build . -t aave-interface
$ docker run -d --name aave-interface -p 3002:3002 aave-interface:latest
```
