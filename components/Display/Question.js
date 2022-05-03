import React from 'react';
import classnames from 'classnames';

const Question = ({ question, isQuestionRevealed, onQuestionClick, showMini }) => {

    return (
        <>
            <div className={classnames('question', {'markOnHover': showMini && !isQuestionRevealed})} onClick={onQuestionClick}>
                {question || <div>&nbsp;</div>}
            </div>

            <style jsx>{`
            .question {
                padding-top: 0.5em;
                overflow: hidden;
                white-space: unset;
                text-overflow: unset;
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

export default Question;
