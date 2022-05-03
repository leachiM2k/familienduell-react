import React from 'react';

const Footer = ({ pointsLeft, pointsCenter, pointsRight }) => {

    return (
        <>
            <div className="footer">
                <div>{String(pointsLeft).padStart(3, '0')}</div>
                <div>{String(pointsCenter).padStart(3, '0')}</div>
                <div>{String(pointsRight).padStart(3, '0')}</div>
            </div>

            <style jsx>{`
            .footer { 
                padding-left: 0.5em;
                padding-right: 0.5em;
                background:#ddff06;
                color: #000000;
            position:absolute; bottom:0px; width:100%; font-family: monospace; display:flex; justify-content: space-between; align-items: center; }
      `}</style>
        </>
    )
};

export default Footer;
