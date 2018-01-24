# deploy to local nginx

yarn build

# Copy everything over
sudo cp -R build/* /usr/share/nginx/html/auth 

# change ownership so it can be served by nginx
sudo chown -R www-data:www-data /usr/share/nginx/html/*