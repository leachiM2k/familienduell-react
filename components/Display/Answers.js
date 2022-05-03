import React from 'react';
import classnames from 'classnames';

const Answers = ({ game, answers, showMini, onAnswerText, onAnswerCount }) => {

    return (
        <>
            <div className="answers">
                {game.currentQuestion && game.currentQuestion.antworten.map((answer, idx) => {
                    if (answers) {
                        answer.antwort = answer.antwort || answers[idx].antwort;
                        answer.anz = answer.anz || answers[idx].anz;
                    }

                    return (
                        <div key={`answer-${game.round}-${idx}`} className="singleAnswer">
                            <div className="answerNr nr">
                                {game.round < 3 ? (idx + 1) + '.' : '>'}
                            </div>
                            <div className={classnames('answerText', {'markOnHover': showMini && !game.answers.includes(idx)})} onClick={onAnswerText && onAnswerText.bind(null, idx)}>
                                {answer.antwort}
                            </div>
                            <div className={classnames('answerPoints', {'markOnHover': showMini && !game.answerCounts.includes(idx)})} onClick={onAnswerCount && onAnswerCount.bind(null, idx)}>
                                {answer.anz || '--'}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
            .answers {
                padding-top: 0.5em;
                overflow: hidden;
                font-family: monospace;
                white-space: nowrap;
            }
             
            .singleAnswer {
                display: flex;
                flex-direction: row;
                gap: 0.25em;
            }

            .answerNr {  }
            .answerText { flex: 1; overflow: hidden; white-space: nowrap; }
            .answerPoints { text-align: right }

            .answerText:after {
                content:'..............................................................................................................';
            }

            .markOnHover:hover{
                color:blue;
                cursor:pointer;
            }
            
            .markOnHover{
                color:gray;
            }
      `}</style>
        </>
    )
};

export default Answers;
