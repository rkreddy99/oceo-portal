import React from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>o-CEO Portal, IITGN</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
