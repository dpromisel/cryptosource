import Head from 'next/head'
import { Page, Text, Image, Display, Button, Grid, Breadcrumbs } from '@geist-ui/react'

export default function Home() {
  const gh = 'https://github.com/geist-org/react'
  const docs = 'https://react.geist-ui.dev'
  const redirect = (url: string) => {
    window.open(url)
  }

  return (
    <div>
      <Head>
        <title>Geist UI with NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page >
      <>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
      </Breadcrumbs>
        <h2>Hello, Everyone.</h2>
        <p>This is a simulated page, you can click anywhere to close it.</p>
      </>
      </Page>
    </div>
  )
}