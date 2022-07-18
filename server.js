const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Timothée!');
});

server.listen(process.env.PORT || 3000);
