import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
          <Head>
              <link rel="preconnect" href="https://fonts.googleapis.com"/>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
              <link rel="short icon" href="favicon.png" type="image/png" />

              <title>ig.news</title>
          </Head>
          <body>
              <Main />
              <NextScript />
          </body>
      </Html>
    )
  }
}
