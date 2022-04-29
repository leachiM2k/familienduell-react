import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head'

config.autoAddCss = false

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Familien Duell</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}
