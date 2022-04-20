#!/bin/sh

SERVICE_NAME=OCTOPUS_API_SERVICE

DATE=`date`

echo "####################################################"
echo "$SERVICE_NAME shutdown..."

Cnt=`ps -ef | grep $SERVICE_NAME | grep -v grep | wc -l`
PROCESS=`ps -ef | grep $SERVICE_NAME | grep -v grep | awk '{print $2}'`

if [ $Cnt -ne 0 ]
then
   kill -9 $PROCESS
   echo "$DATE : $SERVICE_NAME(PID : $PROCESS) Shutdown"
else
   echo "$DATE : $SERVICE_NAME is not running"
fi

echo "###################################################"
