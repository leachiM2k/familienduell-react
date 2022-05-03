import React from 'react';

const Question = ({ question }) => {

    return (
        <>
            <div className="question">
                {question}
            </div>

            <style jsx>{`
            .question {
                padding-top: 0.5em;
                overflow: hidden;
                white-space: unset;
                text-overflow: unset;
            }
      `}</style>
        </>
    )
};

export default Question;
