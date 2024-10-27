let http = require('http');
let url = require('url');
let fs = require('fs');

function startServer(actions) {
    http.createServer((req, res) => {
        // הגדרת הכותרות של CORS
        res.setHeader('Access-Control-Allow-Origin', '*'); // מאפשר גישה לכל הדומיינים
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // מאפשר את כל סוגי הבקשות
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // מאפשר כותרות מסוימות

        // טיפול בבקשות OPTIONS
        if (req.method === 'OPTIONS') {
            res.writeHead(204, { 'Access-Control-Max-Age': 86400 });
            res.end();
            return;
        }

        let q = url.parse(req.url, true);

        if (q.pathname.startsWith('/api')) {
            let action = q.pathname.substring(4);
            if (!actions[action]) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('no such action');
                return;
            }
            actions[action](req, res, q);

        } else {
            //static file
            let allowedContentTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.png': 'image/png',
                '.jpg': 'image/jpg',
                '.gif': 'image/gif',
                '.ico': 'image/x-icon',
                '.txt': 'text/plain',
                '.json': 'application/json'
            };

            let path = (q.pathname == '/') ? '/index.html' : q.pathname;

            // טיפול בבקשות ל-favicon.ico
            if (path === '/favicon.ico') {
                res.writeHead(204, { 'Content-Type': 'image/x-icon' });
                res.end();
                return;
            }

            path = path.substring(1); // כדי להיפטר מהסלש

            let indexOfDot = path.lastIndexOf('.');
            if (indexOfDot == -1) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('invalid file name..');
                return;
            }

            let extension = path.substring(indexOfDot);

            if (!allowedContentTypes[extension]) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('invalid extension..');
                return;
            }

            let contentType = allowedContentTypes[extension];

            fs.readFile("static_files/" + path, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 file not found');
                    return;
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
                return;
            });
        }
    }).listen(8080);
}

exports.startServer = startServer;