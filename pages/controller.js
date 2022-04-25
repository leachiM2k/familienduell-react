import Display from '../components/Display';
import Layout from '../components/Layout';
import React, {useEffect, useRef, useState} from 'react';
import {getQuestions} from '../lib/questions';
import useSocket from '../lib/useSocket';

const WSPort = 3001;
const IP = 'localhost';

const shuffle = a => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

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

const ControllerPage = ({questions}) => {
    const [game, setGame] = useState(initialState);
    const {message, sendMessage} = useSocket();

    useEffect(() => {
        if (message.connection && message.connection === 'connected') {
            handleClick('noop')();
        }
    }, [message])

    const handleClick = (name) => (event) => {
        const gameState = { ...game };

        const buildCurrentQuestion = () => {
            if (gameState.currentQuestionIndex === null) {
                return null;
            }
            const question = questions[gameState.currentQuestionIndex];
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
            noop: () => {},
            setIntro: () => {
                gameState.scene = 'intro';
            },
            setBlackscreen: () => {
                gameState.scene = 'blackscreen';
            },
            nextRound1: () => {
                gameState.round = 1;
                gameState.scene = 'schweinchen';
                if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === questions.length) {
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
                if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === questions.length) {
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
                if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === questions.length) {
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
                if (gameState.currentQuestionIndex === null || gameState.currentQuestionIndex === questions.length) {
                    gameState.currentQuestionIndex = 0;
                } else {
                    gameState.currentQuestionIndex++;
                }
                gameState.answers = [];

                if (gameState.round <= 3) {
                    gameState.scene = 'schweinchen';
                } else {
                    for (let i = 0; i < questions[gameState.currentQuestionIndex].antworten.length; i++) {
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
                questions[gameState.currentQuestionIndex].antworten.forEach((ans, idx) => {
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
            setGame(gameState);
            sendMessage({ game: gameState });
        } else {
            console.error(`Unknown action: ${name}`);
        }
    }

    const handleRoundSelect = (event) => {
        handleClick(event.target.value)();
    }

    const handleQuizContinuation = () => {
        if(game.scene === 'blackscreen') {
            handleClick('setIntro')();
        }
        else if(game.scene === 'intro') {
            handleClick('nextRound1')();
        }
        else if(game.scene === 'schweinchen') {
            handleClick('showQuestion')();
        }
        else if(game.scene === 'questions') {
            if(game.pointsInProgress > 0) {
                alert('Bitte weisen Sie vor dem Fortfahren die Punkte dem linken oder rechten Team zu.');
                return;
            }

            if(game.round < 3) {
                handleClick('nextRound')();
            } else {
                handleClick('finale')();
            }
        }
    }

    const getQuizContinuationValue = () => {
        if(game.scene === 'blackscreen') {
            return 'setBlackscreen';
        }
        else if(game.scene === 'intro') {
            return 'setIntro';
        }
        else if(game.round === 1) {
            return 'nextRound1';
        }
        else if(game.round === 2) {
            return 'nextRound2';
        }
        else if(game.round === 3) {
            return 'nextRound3';
        }
        else if(game.scene === 'finale') {
            return 'finale';
        }
    }

    return (
        <Layout>
            <Display showMini={true} game={game}
                     answers={game.currentQuestionIndex !== null && questions[game.currentQuestionIndex].antworten}
                     onAnswerText={handleClick('answerTextClick')}
                     onAnswerCount={handleClick('answerCountClick')}
                     onFailLeft={game.scene === "questions" ? handleClick('failLeftClick') : null}
                     onFailRight={game.scene === "questions" ? handleClick('failRightClick') : null}
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
                                <button onClick={handleQuizContinuation}>Weiter im Programm</button>
                                <br/>
                                <select size="5" onChange={handleRoundSelect} value={getQuizContinuationValue()}>
                                    <option value="setBlackscreen">Vor Anfang: Bildschirm aus</option>
                                    <option value="setIntro">Anfang: Intro einspielen</option>
                                    <option value="nextRound1">Runde 1: X Top Antworten</option>
                                    <option value="nextRound2">Runde 2: X Top Antworten</option>
                                    <option value="nextRound3">Runde 3: X Top Antworten</option>
                                    <option value="finale">Finale</option>
                                </select>
                            </td>
                            <td>
                                {game.scene === 'schweinchen' && <button onClick={handleClick('showQuestion')}>Fragen anzeigen</button>}
                            </td>
                            <td>
                                <button disabled={(game.right.fails + game.left.fails) === 0} onClick={handleClick('clearFails')} >[X] leeren</button>
                                {game.pointsInProgress > 0 && <>
                                    <br/>
                                    <button onClick={handleClick('pointsToRight')}>Punkte zum rechten Team</button>
                                    <br/>
                                    <button onClick={handleClick('pointsToLeft')}>Punkte zum linken Team</button>
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

export default ControllerPage;
