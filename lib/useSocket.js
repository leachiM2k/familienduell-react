import { useEffect, useRef, useState } from "react";

const WSPort = 3001;
const IP = 'localhost';

const useWebSocket = (room) => {
    const [myClientId, setMyClientId] = useState(null); // Sent and received messages
    const [message, setMessage] = useState([]); // Sent and received messages
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://${IP}:${WSPort}`);

        ws.current.onopen = () => {
            console.log("connected to Websocket Server!!!");
        }

        ws.current.onclose = () => {
            console.log("disconnected from Websocket Server!!!");
        }

        ws.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if(msg.connection && msg.connection === 'hello') {
                setMyClientId(msg.clientId);
                sendMessage({action: 'join', room, clientId: msg.clientId});
            }
            setMessage(() => msg);
            console.log("msg: ", event.data);
        }

        return () => {
            ws.current.close();
        }
    }, []);

    // Sends a message to the server that
    // forwards it to all users in the same room
    const sendMessage = (msg) => {
        const payload = JSON.stringify({ room, ...msg });
        if (ws?.current?.readyState === WebSocket.OPEN) {
            ws.current.send(payload);
        }
    };

    return { message, sendMessage };
};

export default useWebSocket;
