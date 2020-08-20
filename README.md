
<p align="center">
  <img width="200" height="200" src="logo.png">
</p>

# Western's EnactusHacks Website

A NodeJs + Express + MongoDB + Docker Swarm powered website for registration, application, processing, and checking-in of participants to the 2020 [EnactusHacks' Hackathon](http://enactushacks.com).

## Requirements
You must have [Docker](https://www.docker.com/) installed.

## Running Locally

```sh
git clone https://github.com/jeffstjean/enactushacks-website
cd enactushacks-website
cp sample.env .env # fill the .env file with your values
docker stack deploy -c docker-compose.yml -c docker-compose.dev.yml eh
```

Your app should now be running on [localhost](http://localhost/). Edit the server.js and watch Nodemon automatically restart the server.

#### Notes

 - A Nginx replica will forward requests from [http://localhost/](http://localhost/) to the relevant services.
 - A single NodeJS replica (accessible through port 5000) will be spun up.
 - The development configuration will spin up a local MongoDB database.
 - The MongoDB port is opened up to allow for admin access (port 27017, no auth) with an app like [Compass](https://www.mongodb.com/products/compass).


## Deploying for Production

```sh
docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml eh
```

#### Notes
 - This is very similar to deploying for development but the `docker-compose.prod.yml` file is used instead.
 - A [Github workflow](.github/workflows/deploy.yml) is provided to deploy to remote servers via SSH.
 - A Nginx replica will forward requests from the host to the relevant services.
 - Multiple NodeJS replicas will be spun up and are not accessible outside of the Docker network.
 - A [third party MongoDG instance](https://cloud.mongodb.com/) is required.
 - The application will be injected with the PRODUCTION environment variable so no stacktraces will be end-user visible (see [other benefits](https://dzone.com/articles/what-you-should-know-about-node-env) of PRODUCTION).
