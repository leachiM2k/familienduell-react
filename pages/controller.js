import Display from '../components/Display';
import Layout from '../components/Layout';
import React from 'react';
import {getQuestions} from '../lib/questions';

const WSPort = 3001;
const IP = 'localhost';

const initialState = {
    currentQuestionIndex: null,
    currentQuestion: null,
    intro: true,
    blackScreen: true,
    round: 0,
    answers: [],
    answerCounts: [],

    pointsInProgress: 0,

    left: {
        fails: 0,
        points: 0,
    },

    right: {
        fails: 0,
        points: 0,
    },

    sounds: true,

    scene: 'intro' // may be: intro, schweinchen, question, finale
};

export async function getStaticProps() {
    const questions = getQuestions();
    return {
        props: {
            questions
        }
    }
}

export default class ControllerPage extends React.Component {
    constructor() {
        super();
        this.state = { game: { ...initialState } };
    }

    componentDidMount() {
        this.connectWs();
    }

    connectWs() {
        this.ws = new WebSocket('ws://' + IP + ':' + WSPort);

        this.ws.onopen = () => {
            console.log('***** [display:16] ********************** ', this.ws);
            console.log("connected to Websocket Server!!!");
            this.wsSend({ game: this.state.game });
        };

        this.ws.onclose = () => {
            console.log("disconnected from Websocket Server!!!");
        };

        this.ws.onmessage = event => {
            const message = JSON.parse(event.data);
            if (message.connection) {
                /*
                if (message.connection === 'hello') {
                    this.myClientId = message.clientId;
                }
                */
                if (message.connection === 'connected') {
                    console.log('***** New Client connected, sending game state to all client' );
                    this.wsSend({ game: this.state.game });
                }
            }
            console.log("msg: ", message);
        };
    }

    wsSend(msg) {
        const payload = JSON.stringify(msg);
        console.log("send", payload);
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(payload);
        }
    }

    handleClick = (name) => (event) => {
        const gameState = this.state.game;

        const buildCurrentQuestion = () => {
            if (gameState.currentQuestionIndex === null) {
                return null;
            }
            return ({
                frage: this.props.questions[gameState.currentQuestionIndex].frage,
                antworten: this.props.questions[gameState.currentQuestionIndex].antworten.map((ans, idx) => ({
                    antwort: gameState.answers.includes(idx) ? ans.antwort : null,
                    anz: gameState.answerCounts.includes(idx) ? ans.anz : null,
                }))
            });
        };

        const mapNameToAction = {
            startIntro: () => {
                gameState.intro = true;
            },
            stopIntro: () => {
                gameState.intro = false;
            },
            setBlackscreen: () => {
                gameState.blackScreen = !gameState.blackScreen;
            },
            nextRound: () => {
                if (gameState.round < 3) {
                    gameState.round++;
                    if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === this.props.questions.length) {
                        gameState.currentQuestionIndex = 0;
                    } else {
                        gameState.currentQuestionIndex++;
                    }
                    gameState.answers = [];
                    gameState.answerCounts = [];
                    gameState.left.points = 0;
                    gameState.right.points = 0;
                    gameState.left.fails = 0;
                    gameState.right.fails = 0;
                    gameState.scene = 'schweinchen';
                }
            },
            showQuestion: () => {
                gameState.intro = false;
                gameState.blackScreen = false;
                gameState.scene = 'questions';
            },
            answerTextClick: () => {
                gameState.answers.push(event);
            },
            answerCountClick: () => {
                gameState.answerCounts.push(event);
                gameState.pointsInProgress = 0;
                this.props.questions[gameState.currentQuestionIndex].antworten.forEach((ans, idx) => {
                    if(gameState.answerCounts.includes(idx)) {
                        gameState.pointsInProgress += Number(ans.anz);
                    }
                });
                gameState.pointsInProgress = gameState.pointsInProgress * gameState.round;
            },
            failLeftClick: () => {
                gameState.left.fails = event;
            },
            failRightClick: () => {
                gameState.right.fails = event;
            },
            pointsToLeft: () => {
                gameState.left.points += gameState.pointsInProgress;
                gameState.pointsInProgress = 0;
            },
            pointsToRight: () => {
                gameState.right.points += gameState.pointsInProgress;
                gameState.pointsInProgress = 0;
            },
            clearFails: () => {
                gameState.left.fails = 0;
                gameState.right.fails = 0;
            },
        };
        if (mapNameToAction[name]) {
            mapNameToAction[name]();
            gameState.currentQuestion = buildCurrentQuestion();
            this.setState({ game: gameState });
            this.wsSend({ game: gameState });
        }

    }

    render() {
        return (
            <Layout>
                <Display showMini={true} game={this.state.game}
                         answers={this.state.game.currentQuestionIndex !== null && this.props.questions[this.state.game.currentQuestionIndex].antworten}
                         onAnswerText={this.handleClick('answerTextClick')}
                         onAnswerCount={this.handleClick('answerCountClick')}
                         onFailLeft={this.handleClick('failLeftClick')}
                         onFailRight={this.handleClick('failRightClick')}
                />
                <div className="controller">
                    <div id="buttonsDownUnder">
                        <table border="1">
                            <tbody>
                            <tr>
                                <td><b>Intro</b></td>
                                <td><b>Schweinchen</b></td>
                                <td><b>Optionen</b></td>
                                <td><b>Spielende</b></td>
                            </tr>
                            <tr>
                                <td>
                                    <button onClick={this.handleClick('startIntro')}
                                            id="startIntroBtn" disabled={this.state.game.intro === true}>
                                        <i className="fa fa-play"></i> Intro!
                                    </button>
                                    <br/>
                                    <button onClick={this.handleClick('stopIntro')}
                                            id="stopIntroBtn" disabled={this.state.game.intro === false}>
                                        <i className="fa fa-stop"></i> Intro!
                                    </button>
                                    <br/>
                                    <label htmlFor="blackScreenCheck">Blackscreen:</label>
                                    <input onClick={this.handleClick('setBlackscreen')} id="blackScreenCheck"
                                           checked={this.state.game.blackScreen} type="checkbox"
                                           style={{ verticalAlign: 'text-bottom' }}/>
                                </td>
                                <td>
                                    Runde: <input type="number" maxLength={1} style={{ width: '50px' }}
                                                  value={this.state.game.round}/><br/>
                                    <button onClick={this.handleClick('nextRound')}>Nächste Runde</button>
                                    <br/>
                                    <button onClick={this.handleClick('showQuestion')}>Fragen anzeigen</button>
                                </td>
                                <td>
                                    <button onClick={this.handleClick('clearFails')}  id="clearAllFailsBtn">[X] leeren</button>
                                    <br/>
                                    <button onClick={this.handleClick('pointsToLeft')}>Punkte zum rechten Team</button>
                                    <br/>
                                    <button onClick={this.handleClick('pointsToRight')}>Punkte zum linken Team</button>
                                    <br/>
                                </td>
                                <td>
                                    <button id="showFinalScores">Show Final Scores</button>
                                    <br/><br/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table>
                            <tbody>
                            <tr>
                                <td><b>Fragenliste:</b><br/>
                                    <select style={{ minWidth: '400px' }} size="5" id="questionsSelect">
                                        {this.props.questions.map((question, idx) =>
                                            <option key={question.kuerzel}
                                                    selected={this.state.game.currentQuestionIndex === idx}
                                                    value={idx}>{question.kuerzel} {question.antworten.length}</option>
                                        )}
                                    </select>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <style jsx>{`
            #stopIntroBtn {margin-top: 12px; display: block}
            `}</style>

            </Layout>
        )
    }
}
