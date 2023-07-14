@echo off

echo Deploy Started

:: pushd: store the current directory in the directory stack
pushd %DEPLOYMENT_SOURCE%

echo Build React App
export CI=true
call npm run build

IF %ERRORLEVEL% NEQ 0 (
goto error
)

popd

echo Server Sync
git add build -f
SET comment=Autocommit-%date%-%time%
git commit -m "%comment%"
git push origin prod --force-with-lease

goto end

:error
echo Deploy Error
exit

:end
echo Deploy Finished
exit
