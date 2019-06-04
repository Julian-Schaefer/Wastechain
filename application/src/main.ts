import * as express from 'express';
import { startFabric, network } from './fabric';

let app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

let responses = [];

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

app.post('/submit/:orderId', (req, res) => {
    submit(req.params.orderId).then(() => {
        res.send("Done");
    }).catch((e) => {
        res.send("Error: " + e);
    });
})

async function submit(orderId: string) {
    let contract = await network.getContract('Wastechain', 'OrderContract');
    let tx = await contract.submitTransaction('createOrder', orderId, 'Testvalue');
}

startFabric().then(() => console.log("Finished"), (e) => console.log("Error: " + e));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

export function send(data: string) {
    responses.forEach(response => {
        response.write(data);
        response.write('\n\n');
    })
}