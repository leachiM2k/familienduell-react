import classnames from 'classnames';
import Footer from './Display/Footer';
import Answers from './Display/Answers';
import useDimensions from "react-cool-dimensions";
import XMarker from './Display/XMarker';
import Question from './Display/Question';
import Blackscreen from './Display/Blackscreen';
import RoundIntro from './Display/RoundIntro';
import GameIntro from './Display/GameIntro';

const Display = ({ game, question, answers, showMini, onQuestionClick, onAnswerText, onAnswerCount, onFailLeft, onFailRight }) => {
    const { observe, height } = useDimensions();

    return (
        <div className={classnames('display', { 'miniDisplay': showMini })}
             ref={observe} style={{ fontSize: height / 100 * 6 }}>
            {game.scene === 'blackscreen' && <Blackscreen/>}
            {game.scene === 'intro' && <GameIntro/>}

            {game.scene === 'schweinchen' && <RoundIntro round={game.round}/>}

            {game.scene === 'questions' && <>
                <div className="questionAndAnswerContainer">
                    <Question question={game.currentQuestion?.frage || question} isQuestionRevealed={!!game.currentQuestion.frage} onQuestionClick={onQuestionClick} showMini={showMini} />

                    <Answers
                        showMini={showMini}
                        game={game}
                        answers={answers}
                        onAnswerText={onAnswerText}
                        onAnswerCount={onAnswerCount}
                    />
                </div>

                <XMarker game={game} onFailLeft={onFailLeft} onFailRight={onFailRight} />
            </>}

            {game.scene === 'finale' && <div id="resultFinal">
                <div id="resultFinalBox">
                    <div id="SumRes_player1">10</div>
                    <div id="SumRes_player2">20</div>
                </div>
            </div>}

            {game.timer && <div id="timer">20</div>}

            <Footer pointsLeft={game.left.points} pointsCenter={game.pointsInProgress} pointsRight={game.right.points} />

            <style jsx>{`
            .display {
                color:#ddff06;
                font-weight:bold;
                background:#000000;
                position: relative;
                width: 80vw;
                height: 40vw;
                min-height: 520px;
                min-width: 1020px;
                margin: auto;
                margin-bottom: 50px;
                z-index: 5;
                border: 10px #c0c0c0 ridge;
                border-radius: 2px;
                box-shadow: 3px 5px 35px rgba(0, 0, 0, 0.65);
            }

            .miniDisplay {
                width: 1020px;
                height: 520px;
                padding-top: 0;
            }
            .questionAndAnswerContainer {
                padding-left: 20px;
                width: calc(100% - 20px);
            }
            #resultFinal { position:absolute; bottom:95px; width:100%;  }
            #resultFinalBox { display: flex;justify-content: center; }
            #SumRes_player1 { width:6%; float: left; text-align:center; }
            #SumRes_player2 { width:6%; float: right; text-align:center; }
            #timer { 
                position:absolute;
                top: 50%;
                left: 50%;
                width: 400px;
                margin-left: -200px;
                margin-top: -143px;
                text-align: center;
                padding: 0px 30px 10px 30px;
                font-size: 200px;
                background: #000000;
                z-index: 5;
                border: 10px #c0c0c0 ridge;
                border-radius: 2px;
                box-shadow: 3px 5px 35px rgba(0, 0, 0, 0.65);
            }            
      `}</style>
        </div>
    )
};

export default Display;
