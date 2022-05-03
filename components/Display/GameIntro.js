import React from 'react';

const Blackscreen = () => (
    <>
        <img className="introImage" src="./img/logo.png"/>
        <style jsx>{`
            .introImage { position: absolute; top: 0px; width: 100%; height: 100%; z-index: 3; }
        `}</style>
    </>
)

export default Blackscreen;
