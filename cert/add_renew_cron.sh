#!/bin/bash

# run this to add the renew_certificates.sh script to user's cron
# make sure to run 'crontab -e' at least once to install crontab for the user

# ./add_renew_cron.sh path/to/cert/directory

directory=$1

crontab -l > mycron
echo "0 1,12 * * 1-5 $directory/renew_certificates.sh" >> mycron
crontab mycron
rm mycron