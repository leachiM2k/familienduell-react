import React, {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import useSocket from '../lib/useSocket';

const BuzzerPage = () => {
    const [receivedState, setReceivedState] = useState({ });
    const {message, sendMessage, myClientId} = useSocket('buzzer');

    useEffect(() => {
        if(message.message?.state) {
            setReceivedState(message.message.state);
        }
    }, [message])

    const handleJoin = (event) => {
        event.preventDefault();
        const newSettings = Object.fromEntries(new FormData(event.target));
        if(!newSettings.team) {
            alert('Bitte Team auswählen');
            return;
        }
        sendMessage({
            action: 'message',
            message: { ...newSettings, joinDate: Date.now(), join: true },
        });
    }

    const handleBuzz = () => {
        sendMessage({
            action: 'message',
            message: { buzz: true },
        });
    };

    const renderCurrentList = () => {
        const currentListEntries = Object.entries(receivedState.list || {});

        if (currentListEntries.length === 0) {
            return <p>Bisher nimmt niemand am Buzzern teil.</p>
        }

        return (
            <>
                <p>Aktuelle Teilnehmer:</p>

                <ul>
                    {currentListEntries.map(([clientId, {name, team}]) => {
                        return (
                            <li key={clientId}>
                                {name} ({team}) {clientId === myClientId ? ' (du)' : ''}
                            </li>
                        );
                    })}
                </ul>
            </>
        );
    }

    const renderEntry = () => {
        return (
            <>
                <form className="entryForm" onSubmit={handleJoin}>
                    <p>Gebe deinen Daten ein, um mit anderen Buzzern zu können.</p>
                    <input type="text" name="name" placeholder="Name" autoFocus required/>
                    <select name="team" required>
                        <option value="">--- Team wählen ---</option>
                        <option>Team Links</option>
                        <option>Team Rechts</option>
                    </select>
                    <button type="submit" name="join">Los!</button>
                </form>
                <style jsx>{`
                .entryForm {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
            `}</style>
            </>
        );
    };

    const renderBuzzArea = () => {
        if(!receivedState.list || !receivedState.list[myClientId]) {
            return renderEntry();
        }

        if(receivedState.winner) {
            return (
                <>
                    <h2>{receivedState.list[receivedState.winner].name} ({receivedState.list[receivedState.winner].team})</h2>
                    {receivedState.winner === myClientId && <p>Das bist du!</p>}
                </>
            );
        }

        return (
            <>
                <button className="roleButtons" onTouchStart={handleBuzz} onMouseDown={handleBuzz}>BUZZ</button>
                <style jsx>{`
                .roleButtons {
                    font-size: 2em;
                    width: 500px;
                    height: 200px;
                    background: #ddd;
                    padding: 20px;
                    display: block;
                    border: 2px solid;
                }
                .roleButtons:hover {
                    text-decoration: none;
                }
            `}</style>
            </>
        );
    }

    return (
        <Layout>

            <h1>Familienduell Buzzer</h1>

            {renderCurrentList()}

            {renderBuzzArea()}

        </Layout>
    )
};

export default BuzzerPage;
