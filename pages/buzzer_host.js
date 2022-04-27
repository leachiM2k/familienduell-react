import React, {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import useSocket from '../lib/useSocket';
import Head from 'next/head';

const BuzzerHostPage = () => {
    const [buzzerList, setBuzzerList] = useState({});
    const [buzzerWinner, setBuzzerWinner] = useState(null);
    const {message, sendMessage, myClientId} = useSocket('buzzer');

    const sendCurrentState = (list, winner) => {
        sendMessage({
            action: 'message',
            message: {
                state: {
                    list,
                    winner
                }
            }
        });
    }

    useEffect(() => {
        if (message.message && message.message.join) {
            const newBuzzerList = {...buzzerList, [message.clientId]: message.message};
            setBuzzerList(newBuzzerList);
            sendCurrentState(newBuzzerList, buzzerWinner);
        }
        if (message.message && message.message.buzz && buzzerWinner === null) {
            setBuzzerWinner(message.clientId);
            sendCurrentState(buzzerList, message.clientId);
        }
        if(message.action === 'left') {
            const newBuzzerList = {...buzzerList};
            delete newBuzzerList[message.clientId];
            setBuzzerList(newBuzzerList);
            if(buzzerWinner === message.clientId) {
                setBuzzerWinner(null);
            }
            sendCurrentState(newBuzzerList, buzzerWinner);
        }
        if(message.action === 'joined') {
            sendCurrentState(buzzerList, buzzerWinner);
        }
    }, [message]);

    const handleRelease = () => {
        const newBuzzerWinner = null;
        setBuzzerWinner(newBuzzerWinner);
        sendCurrentState(buzzerList, newBuzzerWinner);
    };

    const renderBuzzerList = () => {
        const currentListEntries = Object.entries(buzzerList || {});

        if (currentListEntries.length === 0) {
            return <p>Bisher nimmt niemand am Buzzern teil.</p>
        }

        return (
            <>
                <table className="buzzerList">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Team</th>
                        <th>Beigetreten am</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentListEntries.map(([clientId, entry]) => {
                        return (
                            <tr key={clientId} className={buzzerWinner === clientId && "buzzerWinner"}>
                                <td>{entry.name}</td>
                                <td>{entry.team}</td>
                                <td>{new Intl.DateTimeFormat(undefined, {
                                    day: 'numeric',
                                    month: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                }).format(entry.joinDate)}</td>
                                <td/>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <style jsx>{`
                    .buzzerList {
                        width: 100%;
                    }
                    .buzzerWinner, .buzzerWinner td {
                        background: #ff0;
                    }
            `}</style>
            </>
        );
    }

    return (
        <Layout>
            <Head>
                <title>Familienduell Buzzer Host</title>
            </Head>

            <h1>Familienduell Buzzer Host</h1>

            {renderBuzzerList()}

            {buzzerWinner &&
                <button onClick={handleRelease}>Buzzer freigeben</button>
            }

        </Layout>
    )
};

export default BuzzerHostPage;
