import React from 'react';

const RoundIntro = ({ round }) => {
    if (!round) {
        return null;
    }

    return (
        <>
            {round === 1 && <img className="schweinchenImage" src="./img/schweinchen1.svg"/>}
            {round === 2 && <img className="schweinchenImage" src="./img/schweinchen2.svg"/>}
            {round === 3 && <img className="schweinchenImage" src="./img/schweinchen3.svg"/>}

            <style jsx>{`
            .schweinchenImage {
                height: 75%;
                top: 12.5%;
                position: absolute;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                overflow: hidden;
            }
      `}</style>
        </>
    )
};

export default RoundIntro;
