import Head from 'next/head'
import { Page, Breadcrumbs, Fieldset, Button, Card } from '@geist-ui/react'
import { useRouter } from 'next/router'

export default function Home() {
  const gh = 'https://github.com/geist-org/react'
  const docs = 'https://react.geist-ui.dev'
  const redirect = (url: string) => {
    window.open(url)
  }

  const router = useRouter()

  return (
    <div>
      <Head>
        <title>Geist UI with NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page >
      <>
      <Breadcrumbs>
        <Breadcrumbs.Item onClick={() => router.push("/")}>Home</Breadcrumbs.Item>
      </Breadcrumbs>
     
        <h2> Web3 Community Insights</h2>
        <Card shadow onClick={() => router.push("/tokens")} hoverable>
  <h4>Token Communities </h4>
  <p> Explore the most popular contracts amongst a community of token holders. </p>
</Card>

           </>
      </Page>
    </div>
  )
}