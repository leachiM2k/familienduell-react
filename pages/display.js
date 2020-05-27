import Display from '../components/Display';
import React, {Component} from 'react';
import Layout from '../components/Layout';
import Sound from 'react-sound';

const WSPort = 3001;
const IP = 'localhost';

export default class DisplayPage extends Component {
    constructor() {
        super();
        this.state = { game: null };
    }

    componentDidMount() {
        this.connectWs();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!prevState.game || this.state.playSound) return;
        if (this.state.game.intro && this.state.game.scene === 'intro' && !this.state.game.blackScreen) {
            this.setState({ playSound: './sounds/intro.ogg' });
        }
        if (this.state.game.scene === 'schweinchen') {
            this.setState({ playSound: './sounds/schweinchen.ogg' });
        }
        if (prevState.game.answerCounts.length < this.state.game.answerCounts.length) {
            this.setState({ playSound: './sounds/zahlRichtig.ogg' });
        }
        if (prevState.game.answers.length < this.state.game.answers.length) {
            this.setState({ playSound: './sounds/textRichtig.ogg' });
        }
        if (prevState.game.left.fails < this.state.game.left.fails) {
            this.setState({ playSound: './sounds/fail.ogg' });
        }
        if (prevState.game.right.fails < this.state.game.right.fails) {
            this.setState({ playSound: './sounds/fail.ogg' });
        }
    }

    connectWs() {
        this.ws = new WebSocket('ws://' + IP + ':' + WSPort);

        this.ws.onopen = () => {
            console.log('***** [display:16] ********************** ', this.ws);
            console.log("connected to Websocket Server!!!");
        }

        this.ws.onclose = () => {
            console.log("disconnected from Websocket Server!!!");
        }

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.connection) {
                if (message.connection === 'hello') {
                    this.myClientId = message.clientId;
                }
            }
            if (message.message) {
                if (message.message.game) {
                    this.setState({ game: message.message.game });
                }
            }
            console.log("msg: ", message);
        }
    }

    //
    // wsSend(msg) {
    //     const payload = JSON.stringify(msg);
    //     console.log("send", payload);
    //     if (this.ws.readyState === WebSocket.OPEN) {
    //         this.ws.send(payload);
    //     }
    // }

    playSoundMaybe = () => {
        let soundName = null;
        if (this.state.playSound) {
            soundName = this.state.playSound;
        }
        if (!soundName) {
            return null;
        }
        return (
            <Sound
                url={soundName}
                autoLoad={true}
                playStatus={Sound.status.PLAYING}
                onFinishedPlaying={() => this.setState({ playSound: null })}
            />
        );
    };

    render() {
        if (!this.state.game) {
            return null;
        }
        return (
            <Layout>
                {this.state.game.blackScreen && <div className="blackScreen"/>}
                {this.playSoundMaybe()}
                <Display game={this.state.game}/>
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
    }
}
