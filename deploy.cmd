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
set CUR_HH=%time:~0,2%
if %CUR_HH% lss 10 (set CUR_HH=0%time:~1,1%)
set CUR_NN=%time:~3,2%
set comment=Autocommit-%DATE:~-4%%DATE:~-7,2%%DATE:~-10,2%-%CUR_HH%%CUR_NN%
git commit -m "%comment%"
git push github main --force-with-lease

goto end

:error
echo Deploy Error
exit

:end
echo Deploy Finished
exit
