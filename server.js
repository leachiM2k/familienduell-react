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

const rooms = {
    'game': [],
};

const subscribersById= {};

const broadcastMessageToRoom = (msg, fromClientId, room) => {
    const payload = JSON.stringify(msg);
    rooms[room].filter(clientId => clientId !== fromClientId).forEach(clientId => subscribersById[clientId].send(payload));
};

wss.on('connection', ws => {

    const clientId = generateClientId();
    subscribersById[clientId] = ws;

    ws.send(JSON.stringify({ clientId: clientId, connection: "hello" }));

    console.log(`+++ subscriber ${clientId} JOINED server (current clients count: ${Object.keys(subscribersById).length})`);

    ws.on('message', message => {
        const msg = JSON.parse(message);
        const room = msg.room;
        if (!rooms[room]) {
            ws.send(JSON.stringify({ clientId, action: 'room_unknown', type: 'answer', room }));
            return;
        }

        if (msg.action === 'join') {
            rooms[room].push(clientId);
            ws.send(JSON.stringify({ clientId, action: 'joined', type: 'answer', room }));
            broadcastMessageToRoom({ clientId, action: 'joined', type: 'broadcast', room }, clientId, room);
            console.log(`|   subscriber ${clientId} joined room ${room} (current room clients count: ${rooms[room].length})`);
        } else if (msg.action === 'leave') {
            const index = rooms[room].indexOf(clientId);
            if (index > -1) {
                rooms[room].splice(index, 1);
                ws.send(JSON.stringify({ clientId, action: 'left', type: 'answer', room }));
                broadcastMessageToRoom({ clientId, action: 'left', type: 'broadcast', room }, clientId, room);
                console.log(`|   subscriber ${clientId} left room ${room} (current room clients count: ${rooms[room].length})`);
            }
        } else if (msg.action === 'message') {
            broadcastMessageToRoom({ clientId, action: 'message', type: 'broadcast', room, message: msg.message }, clientId, room);
            console.log(`|   subscriber ${clientId} broadcasts to ${rooms[room].length - 1} clients in room ${room}`);
            console.log(`|   subscriber ${clientId} broadcast message ${JSON.stringify(msg.message)}`);
        }
    });

    ws.on("close", function () {
        delete subscribersById[clientId];
        Object.keys(rooms).forEach(room => {
            const index = rooms[room].indexOf(clientId);
            if (index > -1) {
                rooms[room].splice(index, 1);
                broadcastMessageToRoom({ clientId, action: 'left', type: 'broadcast', room }, clientId, room);
            }
        });
        console.log(`--- subscriber ${clientId} LEFT server (current clients count: ${Object.keys(subscribersById).length})`);
    });
})
