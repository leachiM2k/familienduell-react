import Display from '../components/Display';
import React, {Component, useEffect, useRef, useState} from 'react';

import Layout from '../components/Layout';
import Sound from 'react-sound';

const WSPort = 3001;
const IP = 'localhost';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const DisplayPage = () => {
    const [audioDisabled, setAudioDisabled] = useState(true);
    const [playSound, setPlaySound] = useState(null);
    const [game, setGame] = useState(null);
    const prevGame = usePrevious(game);
    const ws = useRef(null);

    const connectWs = () => {
        ws.current = new WebSocket('ws://' + IP + ':' + WSPort);

        ws.current.onopen = () => {
            console.log('***** [display:16] ********************** ', ws);
            console.log("connected to Websocket Server!!!");
        }

        ws.current.onclose = () => {
            console.log("disconnected from Websocket Server!!!");
        }

        ws.current.onmessage = (event) => {
            console.log('***** [display:39] ********************** ' );
            const message = JSON.parse(event.data);
            if (message.connection) {
                if (message.connection === 'hello') {
                    // this.myClientId = message.clientId;
                }
            }
            if (message.message) {
                if (message.message.game) {
                    setGame(message.message.game);
                }
            }
            console.log("msg: ", message);
        }

        return () => {
            ws.current.close();
        }
    }

    useEffect(() => {
        console.log('***** [display:57] ********************** ' );
        if (!prevGame) {
            return;
        }
        if (prevGame.scene !== game.scene && game.scene === 'intro') {
            setPlaySound('./sounds/intro.ogg');
        }
        if (prevGame.scene !== game.scene && game.scene === 'schweinchen') {
            setPlaySound('./sounds/schweinchen.ogg');
        }
        if (prevGame.answerCounts.length < game.answerCounts.length) {
            setPlaySound('./sounds/zahlRichtig.ogg');
        }
        if (prevGame.answers.length < game.answers.length) {
            setPlaySound('./sounds/textRichtig.ogg');
        }
        if (prevGame.left.fails < game.left.fails) {
            setPlaySound('./sounds/fail.ogg');
        }
        if (prevGame.right.fails < game.right.fails) {
            setPlaySound('./sounds/fail.ogg');
        }
    }, [game]);

    useEffect(() => {
        return connectWs();
    }, []);

    const playSoundMaybe = () => {
        if (!playSound) {
            return null;
        }
        return (
            <Sound
                url={playSound}
                autoLoad={true}
                playStatus={Sound.status.PLAYING}
                onFinishedPlaying={() => {
                    setPlaySound(null);
                }}
            />
        );
    };

    if (!game) {
        return (
            <Layout>
                <h1>Waiting for game to start...</h1>
            </Layout>
        );
    }

    return (
        <Layout>
            {audioDisabled &&
                <button style={{zIndex:1020, position:'absolute', bottom: 0}} onClick={() => {
                    setAudioDisabled(false);
                    setPlaySound('./sounds/zahlRichtig.ogg');
                }}>
                    Enable Audio
                </button>
            }
            {game.scene === 'blackscreen' && <div className="blackScreen"/>}
            {playSoundMaybe()}
            <Display game={game}/>
            <style jsx>{`
                .blackScreen {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    z-index: 1000;
                }
              `}</style>
        </Layout>
    )
};

export default DisplayPage;
