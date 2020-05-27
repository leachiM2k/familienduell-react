export default function Display(props) {
    const showSchweinchen = () => {
        if (!props.game.round || props.game.scene !== 'schweinchen') {
            return null;
        }
        if (props.game.round === 1) {
            return <img id="schweinchen1Img" className="schweinchenImage" src="./img/schweinchen1.png"/>;
        }
        if (props.game.round === 2) {
            return <img id="schweinchen2Img" className="schweinchenImage" src="./img/schweinchen2.png"/>;
        }
        if (props.game.round === 3) {
            return <img id="schweinchen3Img" className="schweinchenImage" src="./img/schweinchen3.png"/>;
        }
    };

    const onAnswerText = props.onAnswerText || function () {};
    const onAnswerCount = props.onAnswerCount || function () {};
    const onFailLeft = props.onFailLeft || function () {};
    const onFailRight = props.onFailRight || function () {};

    return (
        <div className={"topContainer bgColor textColor mainHeight " + (props.showMini && "miniDisplay")} id="display">
            {showSchweinchen()}

            {props.game.scene === 'questions' && <div>
                <div id="displayQuestions" className="textColor questionAnswerContainer">
                    {props.game.currentQuestion && props.game.currentQuestion.frage}
                </div>

                <div id="answers" className="questionAnswerContainer">
                    {props.game.currentQuestion && props.game.currentQuestion.antworten.map((answer, idx) => {
                        if (props.answers) {
                            answer.antwort = answer.antwort || props.answers[idx].antwort;
                            answer.anz = answer.anz || props.answers[idx].anz;
                        }
                        let antwortText = ".".repeat(47);
                        if (answer.antwort) {
                            antwortText = answer.antwort + ' ' + ".".repeat(47 - answer.antwort.length + 1);
                        }
                        let anzText = '--';
                        if (answer.anz) {
                            anzText = answer.anz;
                        }
                        return (
                            <div>
                                <div className="answerNr nr">{idx + 1}.</div>
                                <div className="answer answerText"><span
                                    className={props.showMini && !props.game.answers.includes(idx) && "markOnHover"}
                                    onClick={onAnswerText.bind(null, idx)}>{antwortText}</span>
                                </div>
                                <div className="points answerPoints"><span
                                    className={props.showMini && !props.game.answerCounts.includes(idx) && "markOnHover"}
                                    onClick={onAnswerCount.bind(null, idx)}>{anzText}</span></div>
                            </div>
                        );
                    })}
                </div>

                <div id="result" className="resultContainer">
                    <div className="header_summe headerSumme">SUMME</div>
                    <div id="SumRes">0</div>
                </div>
            </div>}
            {props.game.scene === 'finale' && <div id="resultFinal">
                <div id="resultFinalBox">
                    <div id="SumRes_player1">10</div>
                    <div id="SumRes_player2">20</div>
                </div>
            </div>}
            {props.game.timer && <div id="timer">20</div>}
            <div className="footer" id="footer1">
                <div className="pointsLeft">{props.game.left.points}</div>
                <div id="pointsCenter">{props.game.pointsInProgress}</div>
                <div className="pointsRight">{props.game.right.points}</div>
            </div>

            <div className="xmarker xmarkerLeft markerStyle">
                <span className={props.game.left.fails < 1 ? "marker" : "marker fail"}
                      onClick={onFailLeft.bind(null, 1)}>X</span>
                <span className={props.game.left.fails < 2 ? "marker" : "marker fail"}
                      onClick={onFailLeft.bind(null, 2)}>X</span>
                <span className={props.game.left.fails < 3 ? "marker" : "marker fail"}
                      onClick={onFailLeft.bind(null, 3)}>X</span>
            </div>
            <div className="xmarker xmarkerRight markerStyle">
                <span className={props.game.right.fails < 1 ? "marker" : "marker fail"}
                      onClick={onFailRight.bind(null, 1)}>X</span>
                <span className={props.game.right.fails < 2 ? "marker" : "marker fail"}
                      onClick={onFailRight.bind(null, 2)}>X</span>
                <span className={props.game.right.fails < 3 ? "marker" : "marker fail"}
                      onClick={onFailRight.bind(null, 3)}>X</span>
            </div>
            {props.game.intro && <img className="intro introImage" src="./img/logo.png"/>}
            {props.game.blackScreen && <div className="blackScreen"/>}

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
            .miniDisplay {
                width: 1020px;
                height: 520px;
                padding-top: 0;
            }
            .miniDisplay #answers, .miniDisplay #displayQuestions { font-size: 1.5em; }                        
            .introImage { position: absolute; top: 0px; width: 100%; height: 100%; }
            .xmarkerLeft { position: absolute; bottom: -64px; left: 34px }
            .xmarkerRight{ position: absolute; bottom: -64px; right: 34px }
            .marker { cursor:pointer; position:relative; top:-5px; padding-left: 4px; padding-right: 4px; }
            .marker.fail { color: rgb(211, 16, 16); }
            .resultContainer { position:absolute; bottom:65px; right:38px; font-size: 1.5em; }
            .headerSumme { float:left; padding-right: 20px; } 
            #SumRes { width:50px; float: left; text-align:right; }
            #resultFinal { position:absolute; bottom:95px; width:100%; font-size: 1.5em; }
            #resultFinalBox { display: flex;justify-content: center; }
            #SumRes_player1 { width:6%; float: left; text-align:center; }
            #SumRes_player2 { width:6%; float: right; text-align:center; }
            #timer { position:absolute; top: 50%; left: 50%; width: 400px; margin-left: -200px; margin-top: -143px; text-align: center; padding: 0px 30px 10px 30px; font-size: 200px; }
            #footer1 { position:absolute; bottom:0px; width:100%; height:50px; font-size: 2em; }
            .pointsLeft { position:absolute; left:35px; top: -5px; }
            #pointsCenter { position:absolute; left:50%; width: 80px; margin-left: -40px; top: -5px; text-align: center }
            .pointsRight { position:absolute; right:35px; top: -5px; }
            
            .answerNr { width: 5%; text-align: center; float: left; }
            .answerText { width: 89%; text-align: center; float: left }
            .answerPoints { width: 6%; float: left; text-align: right }
      `}</style>
        </div>
    )
}
