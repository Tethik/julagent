import Head from "next/head";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Tomtens Hemliga Agent</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"></meta>
        <link rel="manifest" href="manifest.webmanifest"></link>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
