#!/bin/bash

# run this every 12 hours!
# 0 0,12 * * * enactus-prod/renew_certificates.sh  

docker run --rm --name letsencrypt -v "/etc/letsencrypt:/etc/letsencrypt" -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
    -v "/usr/share/nginx/html:/usr/share/nginx/html" certbot/certbot:latest renew --quiet