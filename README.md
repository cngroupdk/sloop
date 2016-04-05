# sloop
Single Page Application for showing posts from defined accounts at social networks

FB Feed
- set AppID in configuration.js

Twitter Feed
- set consumer key and secret + access token and secret in server.js
- start server 'node server/server.js', running at port 9999
- setup a proxy for redirecting from server:

nginx example:
server {
    listen       80;
    server_name jobfair.cngroup.dk;

    root  path to project;
    index /index.html;

    location /twitter/timeline {
        proxy_pass http://localhost:9999/twitter/timeline;
    }
}
