import React from 'react';

const Blackscreen = () => (
    <>
        <div className="blackScreen"/>
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
    </>
)

export default Blackscreen;
