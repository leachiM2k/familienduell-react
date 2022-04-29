import Head from 'next/head'
import React from 'react';
import Layout from '../components/Layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faDesktop,
    faKeyboard,
    faCircleDot,
    faHammer,
} from '@fortawesome/free-solid-svg-icons';

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>Familien Duell Rollenauswahl</title>
            </Head>

            <h1>Familienduell</h1>
            <a href="/display" className="roleButtons" id="displayBtn">
                <FontAwesomeIcon icon={faDesktop} /> DISPLAY
            </a>
            <br/>
            <a href="/controller" id="controllerBtn" className="roleButtons">
                <FontAwesomeIcon icon={faKeyboard} /> CONTROLLER
            </a>
            <br/>
            <a href="/buzzer" id="controllerBtn" className="roleButtons">
                <FontAwesomeIcon icon={faCircleDot} /> BUZZER
            </a>
            <br/>
            <a href="/buzzer_host" id="controllerBtn" className="roleButtons">
                <FontAwesomeIcon icon={faHammer} /> BUZZER CONTROLLER
            </a>

            <style jsx>{`
                .roleButtons {
                    text-decoration: none;
                    font-size: 2em;
                    width: 500px;
                    background: #ddd;
                    padding: 20px;
                    display: block;
                    color: #008;
                    border: 2px solid #008;               
                }
                .roleButtons:hover {
                    text-decoration: none;
                    background: #eee;
                }
            `}</style>
        </Layout>
    )
}
