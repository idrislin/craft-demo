rm .\\test.tar.gz
docker rmi test:latest
docker build -t vite-app:latest . 
docker save -o vite-app.tar.gz vite-app:latest