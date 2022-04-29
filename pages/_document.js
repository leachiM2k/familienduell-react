import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="stylesheet" type="text/css" href="./css/main.css"/>
                <meta httpEquiv="content-type" content="text/html; charset=utf-8"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
