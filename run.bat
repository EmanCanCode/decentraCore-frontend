@echo off
REM Stop and remove any old container named "app"
docker stop app 2>nul
docker rm app 2>nul

REM Optionally remove the old image (uncomment next line for fresh rebuild always)
REM docker rmi app:prod 2>nul

REM Build a fresh image
docker build -t app:prod .

REM Run new container
docker run -p 8080:80 --name app app:prod
