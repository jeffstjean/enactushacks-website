#!/bin/bash

# run this to add the renew_certificates.sh script to user's cron

directory=$1

crontab -l > mycron
echo "0 1,12 * * 1-5 $directory/renew_certificates.sh" >> mycron
crontab mycron
rm mycron