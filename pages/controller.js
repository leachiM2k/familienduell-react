import Display from '../components/Display';
import Layout from '../components/Layout';
import React from 'react';
import {getQuestions} from '../lib/questions';

const WSPort = 3001;
const IP = 'localhost';

const initialState = {
    currentQuestionIndex: null,
    currentQuestion: null,
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

    scene: 'blackscreen' // may be: blackscreen, intro, schweinchen, questions, finale
};

export async function getStaticProps() {
    const questions = shuffle(getQuestions());

    questions.forEach(question => {
        question.antworten.sort((a, b) => b.anz - a.anz);
    });

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
            const question = this.props.questions[gameState.currentQuestionIndex];
            let antworten = [...question.antworten];
            if(gameState.round > 3) {
                antworten = gameState.answers.map(idx => antworten[idx])
            }
            return ({
                frage: question.frage,
                antworten: antworten.map((ans, idx) => ({
                    antwort: gameState.answers.includes(idx) ? ans.antwort : null,
                    anz: gameState.answerCounts.includes(idx) ? ans.anz : null,
                }))
            });
        };

        const mapNameToAction = {
            setIntro: () => {
                gameState.scene = 'intro';
            },
            setBlackscreen: () => {
                gameState.scene = 'blackscreen';
            },
            nextRound1: () => {
                gameState.round = 1;
                gameState.scene = 'schweinchen';
                if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === this.props.questions.length) {
                    gameState.currentQuestionIndex = 0;
                } else {
                    gameState.currentQuestionIndex++;
                }
                gameState.answers = [];
                gameState.answerCounts = [];
                gameState.left.fails = 0;
                gameState.right.fails = 0;
                gameState.pointsInProgress = 0;
            },
            nextRound2: () => {
                gameState.round = 2;
                gameState.scene = 'schweinchen';
                if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === this.props.questions.length) {
                    gameState.currentQuestionIndex = 0;
                } else {
                    gameState.currentQuestionIndex++;
                }
                gameState.answers = [];
                gameState.answerCounts = [];
                gameState.left.fails = 0;
                gameState.right.fails = 0;
                gameState.pointsInProgress = 0;
            },
            nextRound3: () => {
                gameState.round = 3;
                gameState.scene = 'schweinchen';
                if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === this.props.questions.length) {
                    gameState.currentQuestionIndex = 0;
                } else {
                    gameState.currentQuestionIndex++;
                }
                gameState.answers = [];
                gameState.answerCounts = [];
                gameState.left.fails = 0;
                gameState.right.fails = 0;
                gameState.pointsInProgress = 0;
            },
            nextRound: () => {
                gameState.round++;
                if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === this.props.questions.length) {
                    gameState.currentQuestionIndex = 0;
                } else {
                    gameState.currentQuestionIndex++;
                }
                gameState.answers = [];

                if (gameState.round <= 3) {
                    gameState.scene = 'schweinchen';
                } else {
                    for (let i = 0; i < this.props.questions[gameState.currentQuestionIndex].antworten.length; i++) {
                        gameState.answers.push(i);
                    }
                    shuffle(gameState.answers);
                    gameState.scene = 'questions';
                }

                gameState.answerCounts = [];
                gameState.left.fails = 0;
                gameState.right.fails = 0;
                gameState.pointsInProgress = 0;
            },
            showQuestion: () => {
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
        } else {
            console.error(`Unknown action: ${name}`);
        }
    }

    handleRoundSelect = (event) => {
        this.handleClick(event.target.value)();
    }

    handleQuizContinuation = () => {
        if(this.state.game.scene === 'blackscreen') {
            this.handleClick('setIntro')();
        }
        else if(this.state.game.scene === 'intro') {
            this.handleClick('nextRound1')();
        }
        else if(this.state.game.scene === 'schweinchen') {
            this.handleClick('showQuestion')();
        }
        else if(this.state.game.scene === 'questions') {
            if(this.state.game.pointsInProgress > 0) {
                alert('Bitte weisen Sie vor dem Fortfahren die Punkte dem linken oder rechten Team zu.');
                return;
            }

            if(this.state.game.round < 3) {
                this.handleClick('nextRound')();
            } else {
                this.handleClick('finale')();
            }
        }
    }

    render() {
        return (
            <Layout>
                <Display showMini={true} game={this.state.game}
                         answers={this.state.game.currentQuestionIndex !== null && this.props.questions[this.state.game.currentQuestionIndex].antworten}
                         onAnswerText={this.handleClick('answerTextClick')}
                         onAnswerCount={this.handleClick('answerCountClick')}
                         onFailLeft={this.state.game.scene === "questions" ? this.handleClick('failLeftClick') : null}
                         onFailRight={this.state.game.scene === "questions" ? this.handleClick('failRightClick') : null}
                />
                <div className="controller">
                    <div id="buttonsDownUnder">
                        <table border="1">
                            <tbody>
                            <tr>
                                <td><b>Rundenauswahl</b></td>
                                <td><b>Schweinchen</b></td>
                                <td><b>Optionen</b></td>
                                <td><b>Spielende</b></td>
                            </tr>
                            <tr>
                                <td>
                                    <button onClick={this.handleQuizContinuation}>Weiter im Programm</button>
                                    <br/>
                                    <select size="5" onChange={this.handleRoundSelect}>
                                        <option value="setBlackscreen" selected={this.state.game.scene === 'blackscreen'}>Vor Anfang: Bildschirm aus</option>
                                        <option value="setIntro" selected={this.state.game.scene === 'intro'}>Anfang: Intro einspielen</option>
                                        <option value="nextRound1" selected={this.state.game.round === 1}>Runde 1: X Top Antworten</option>
                                        <option value="nextRound2" selected={this.state.game.round === 2}>Runde 2: X Top Antworten</option>
                                        <option value="nextRound3" selected={this.state.game.round === 3}>Runde 3: X Top Antworten</option>
                                        <option value="finale" selected={this.state.game.scene === 'finale'}>Finale</option>
                                    </select>
                                </td>
                                <td>
                                    {this.state.game.scene === 'schweinchen' && <button onClick={this.handleClick('showQuestion')}>Fragen anzeigen</button>}
                                </td>
                                <td>
                                    <button disabled={(this.state.game.right.fails + this.state.game.left.fails) === 0} onClick={this.handleClick('clearFails')} >[X] leeren</button>
                                    {this.state.game.pointsInProgress > 0 && <>
                                        <br/>
                                        <button onClick={this.handleClick('pointsToRight')}>Punkte zum rechten Team</button>
                                        <br/>
                                        <button onClick={this.handleClick('pointsToLeft')}>Punkte zum linken Team</button>
                                        <br/>
                                    </>}
                                </td>
                                <td>
                                    <button>Show Final Scores</button>
                                    <br/><br/>
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

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
