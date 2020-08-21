#!/bin/bash

# run this to get your first certificate (make sure nginx isn't currently running!)

domain=$1
email=$2

docker run --rm -p 443:443 -p 80:80 --name letsencrypt -v "/etc/letsencrypt:/etc/letsencrypt" \
    -v "/var/lib/letsencrypt:/var/lib/letsencrypt" certbot/certbot certonly -n -m "$email" -d $domain --standalone --agree-tos