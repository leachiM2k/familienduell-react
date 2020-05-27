import Head from 'next/head'

export default function Layout({ children }) {
    return (
        <div>
            <Head>
                <title>Familien Duell</title>
                <link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css"/>
                <link rel="stylesheet" type="text/css" href="./css/font-awesome.min.css"/>
                <link rel="stylesheet" type="text/css" href="./css/main.css"/>
                <meta httpEquiv="content-type" content="text/html; charset=utf-8"/>
            </Head>
            {children}
        </div>
    )
}
