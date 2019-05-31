import * as express from 'express';

let app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var responses = [];

app.get('/event-stream', (req, res) => {
    // SSE Setup
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    res.write('\n');

    responses.push(res);

    req.on('close', () => {
        console.log("Closed");
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

let messageId = 0;