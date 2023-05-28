const http = require('http');
const fs = require('fs');


function express() {
  const routes = [];

  function get(route, handler) {
    routes.push({ method: 'GET', route, handler });
  }

  function post(route, handler) {
    routes.push({ method: 'POST', route, handler });
  }

  function put(route, handler) {
    routes.push({ method: 'PUT', route, handler });
  }

  function del(route, handler) {
    routes.push({ method: 'DELETE', route, handler });
  }

  function listen(port, callback) {
    const server = http.createServer((req, res) => {
      const { url, method } = req;
      const route = routes.find(r => {
        req.params = {}; 

        const routeParts = r.route.split('/');
        const urlParts = url.split('/');

        if (routeParts.length !== urlParts.length) {
          return false;
        }

        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(':')) {
            req.params[routeParts[i].slice(1)] = urlParts[i];
          } else if (routeParts[i] !== urlParts[i]) {
            return false;
          }
        }

        return r.method === method;
      });

      if (route) {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', () => {
// // Extracting request body
          req.body = body.length > 0 ? JSON.parse(body) : {};

// // Extracting request params
          const [, ...params] = req.url.split('/');
          req.params = params;

//  // Extracting request headers
          req.headers = req.headers;

//  // Extracting request query
          const queryString = req.url.split('?')[1] || '';
          req.query = parseQueryString(queryString);

//  //  res.send() 
           res.send = function(data) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(data);
          };          

//  // res.json() 
          res.json = function(data) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

//  // res.status()
          res.status = function(code) {
            res.statusCode = code;
            return res;
          };          
// // res.sendfile
          res.sendFile = function(filePath) {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                res.status(500).send('Error reading file');
              } else {
                res.setHeader('Content-Type', 'application/octet-stream');
                res.end(data);
              }
            });
          };

          route.handler(req, res);
        });
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    });

    server.listen(port, () => {
      if (callback) {
        callback();
      }
    });
  }

  function parseQueryString(queryString) {
    const query = {};
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      query[key] = value;
    }
    return query;
  }

  return {
    get,
    post,
    put,
    delete: del,
    listen
  };
}

module.exports = express;
