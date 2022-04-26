import Display from '../components/Display';
import React, {Component, useEffect, useRef, useState} from 'react';

import Layout from '../components/Layout';
import Sound from 'react-sound';
import useSocket from '../lib/useSocket';

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
    const {message, sendMessage} = useSocket('game');

    useEffect(() => {
        if(message.message?.game) {
            setGame(message.message.game);
        }
    }, [message])

    useEffect(() => {
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
                <button className="enableAudioButton" onClick={() => {
                    setAudioDisabled(false);
                    setPlaySound('./sounds/zahlRichtig.ogg');
                }}>
                    <i className="fa fa-volume-up"/> Enable Audio
                </button>
            }
            {game.scene === 'blackscreen' && <div className="blackScreen"/>}
            {playSoundMaybe()}
            <Display game={game}/>
            <style jsx>{`
                .enableAudioButton {
                    position: absolute;
                    left: 0;
                    bottom: 20%;
                    width: 100%;
                    z-index: 1020;
                    font-size: 3rem;
                }
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
