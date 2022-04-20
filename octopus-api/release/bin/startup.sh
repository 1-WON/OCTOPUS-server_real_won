#!/bin/sh

export GIN_MODE=release
export OCTOPUS_API_HOME=/home/ubuntu/octopus-api
SERVICE_NAME=OCTOPUS_API_SERVICE

DATE=`date`

echo "####################################################"
echo "$SERVICE_NAME startup..."

Cnt=`ps -ef | grep $SERVICE_NAME | grep -v grep | wc -l`
PROCESS=`ps -ef | grep $SERVICE_NAME | grep -v grep | awk '{print $2}'`

if [ $Cnt -ne 0 ]
then
   echo "$DATE : $SERVICE_NAME(PID : $PROCESS) is already running"
else
   nohup $OCTOPUS_API_HOME/bin/octopus-server -service=$SERVICE_NAME >> $OCTOPUS_API_HOME/log/octopus-server.log 2>&1 &
   echo "$DATE : $SERVICE_NAME startup"
fi

echo "###################################################"
