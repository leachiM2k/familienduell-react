import React from 'react';
import classnames from 'classnames';

const XMarker = ({ game, onFailLeft, onFailRight }) => {

    return (
        <>
            <div className={classnames('xmarker', 'xmarkerLeft', { 'markerStyle': !!onFailLeft })}>
            <span className={game.left.fails < 1 ? "marker" : "marker fail"}
                  onClick={() => onFailLeft && onFailLeft(1)}>X</span>
                <span className={game.left.fails < 2 ? "marker" : "marker fail"}
                      onClick={() => onFailLeft && onFailLeft(2)}>X</span>
                <span className={game.left.fails < 3 ? "marker" : "marker fail"}
                      onClick={() => onFailLeft && onFailLeft(3)}>X</span>
            </div>

            <div className={classnames('xmarker', 'xmarkerRight', { 'markerStyle': !!onFailRight })}>
            <span className={game.right.fails < 1 ? "marker" : "marker fail"}
                  onClick={() => onFailRight && onFailRight(1)}>X</span>
                <span className={game.right.fails < 2 ? "marker" : "marker fail"}
                      onClick={() => onFailRight && onFailRight(2)}>X</span>
                <span className={game.right.fails < 3 ? "marker" : "marker fail"}
                      onClick={() => onFailRight && onFailRight(3)}>X</span>
            </div>

            <style jsx>{`
            .xmarker {
                font-family: Verdana, Helvetica, sans-serif;
                font-weight: bold;
                z-index: 3;
                box-shadow: 3px 5px 35px rgba(0, 0, 0, 0.65);
                border: 2px #595959 solid;
                border-radius: 2px;
                text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.15), 1px 1px 1px rgba(255, 255, 255, 0.20);
                background: #595959;
                height: 1.5em;
                padding-left: 12px;
                padding-right: 12px;
                color: rgb(66, 66, 66);
                /* box-shadow: 5px 5px 5px -1px rgba(0, 0, 0, 0.65), 0 5px 5px -5px rgba(0, 0, 0, 0.65); */
                font-size: 1.5em;
            }
            .xmarkerLeft { position: absolute; bottom: -1.6em; left: 1em }
            .xmarkerRight{ position: absolute; bottom: -1.6em; right: 1em }
            ,markerStyle { cursor: pointer; }
            .marker { position:relative; top:-5px; padding-left: 4px; padding-right: 4px; }
            .marker.fail { color: rgb(211, 16, 16); }
      `}</style>
        </>
    )
};

export default XMarker;
