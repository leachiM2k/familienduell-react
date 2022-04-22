import Head from 'next/head'
import React from 'react';
import Layout from '../components/Layout';

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>Familien Duell Rollenauswahl</title>
            </Head>

            <h1>Familienduell</h1>
            <a href="/display" className="roleButtons" id="displayBtn">
                <i className="fa fa-desktop"></i> DISPLAY
            </a>
            <br/>
            <a href="/controller" id="controllerBtn" className="roleButtons">
                <i className="fa fa-keyboard-o"></i> CONTROLLER
            </a>

            <style jsx>{`
                .roleButtons {
                    font-size: 2em;
                    width: 500px;
                    background: #ddd;
                    padding: 20px;
                    display: block;
                    border: 2px solid;
                }
                .roleButtons:hover {
                    text-decoration: none;
                }
            `}</style>
        </Layout>
    )
}
