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

const generateClientId = () => Math.random().toString(36).substr(2, 9);

const broadcastMessage = (msg, fromClientId) => {
    const payload = JSON.stringify(msg);
    console.log(`broadcast: ${payload} from ${fromClientId} to ${Object.keys(subscribersById).length} clients`);
    Object.keys(subscribersById).forEach(clientId => {
        if (clientId !== fromClientId) {
            subscribersById[clientId].send(payload);
        }
    });
};

const subscribersById= {};

wss.on('connection', ws => {

    const clientId = generateClientId();
    subscribersById[clientId] = ws;

    ws.send(JSON.stringify({ clientId: clientId, connection: "hello" }));

    broadcastMessage({ clientId: clientId, connection: "connected" }, clientId);

    console.log(`~~~~~~~~ WELCOME TO SERVER ~~~~~~ (current clients count: ${Object.keys(subscribersById).length}, new client id: ${clientId})`);

    ws.on('message', message => {
        broadcastMessage({ clientId, message: JSON.parse(message) }, clientId);
    });

    ws.on("close", function () {
        delete subscribersById[clientId];
        broadcastMessage({ clientId, connection: "disconnected" }, clientId);
        console.log(`Subscriber ${clientId} left. Remaining ${Object.keys(subscribersById).length} clients.`);
    });
})
