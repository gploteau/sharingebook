@echo off

echo Deploy Started

:: pushd: store the current directory in the directory stack
pushd %DEPLOYMENT_SOURCE%

echo Build React App
call npm run build

IF %ERRORLEVEL% NEQ 0 (
goto error
)

popd

echo Server Sync
git add --all
git add build -f
set CUR_YYYY=%date:~10,4%
set CUR_MM=%date:~4,2%
set CUR_DD=%date:~7,2%
set CUR_HH=%time:~0,2%
if %CUR_HH% lss 10 (set CUR_HH=0%time:~1,1%)
set CUR_NN=%time:~3,2%
set CUR_SS=%time:~6,2%
set comment=Autocommit-%CUR_YYYY%%CUR_MM%%CUR_DD%-%CUR_HH%%CUR_NN%%CUR_SS%
git commit -m "%comment%"
git push github main --force-with-lease

goto end

:error
echo Deploy Error
exit

:end
echo Deploy Finished
exit
