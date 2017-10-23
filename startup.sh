#export LANG=zh_CN.gbk

EXE_NAME=tom-apd

for PID in `ps -ef | grep -v grep |grep node | grep $EXE_NAME | awk '{print $2}'`
do kill -9 $PID
done



node bin/www > logs.log &