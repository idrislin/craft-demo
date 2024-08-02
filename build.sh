rm .\\vite-app.tar.gz
docker rmi vite-app:latest
docker build -t vite-app:latest . 
docker save -o vite-app.tar.gz vite-app:latest