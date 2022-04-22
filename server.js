const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const port = 3000;
const wsport = port + 1;
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: wsport });

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });

const handle = app.getRequestHandler();
const handler = (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
        app.render(req, res, '/b', query)
    } else if (pathname === '/b') {
        app.render(req, res, '/a', query)
    } else {
        handle(req, res, parsedUrl)
    }
};
const serverApp = createServer(handler);

app.prepare().then(() => {
    serverApp.listen(port, (err) => {
        if (err) {
            throw err
        }
        console.log('> Ready on http://localhost:3000')
    })
})

const subscribers = [];
wss.on('connection', ws => {

    subscribers.push(ws);
    const cId = getClientId();

    ws.send(JSON.stringify({ clientId: cId, connection: "hello" }));

    broadcastMessage({ clientId: cId, connection: "connected" });

    console.log("~~~~~~~~ WELCOME TO SERVER ~~~~~~ s:" + subscribers.length, cId);
    ws.on('message', function (message) {
        const payload = JSON.parse(message);
        broadcastMessage({ clientId: cId, message: payload });
    });

    ws.on("close", function () {
        subscribers.splice(cId, 1);
        broadcastMessage({ clientId: cId, connection: "disconnected" });
        console.log('Subscriber left: ' + subscribers.length + " total.");
    });

    function getClientId() {
        for (var i = 0; i < subscribers.length; i++) {
            if (subscribers[i] === ws) {
                return i;
            }
        }
    }
})

function broadcastMessage(msg) {
    const payload = JSON.stringify(msg);
    console.log("broadcast:" + payload + " receiver count:" + subscribers.length);
    subscribers.forEach(subscriber => {
        subscriber.send(payload);
    })
}
