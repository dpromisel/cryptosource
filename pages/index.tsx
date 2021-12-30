import Head from 'next/head'
import { Page, Breadcrumbs, Fieldset, Button, Card } from '@geist-ui/react'
import { useRouter } from 'next/router'
import {
  injected,
} from '../connectors'
import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import React from 'react'
import Particles from 'react-tsparticles'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  )
}

function Home() {
  const { activate, account, active, chainId, library } = useWeb3React<Web3Provider>()
  // const { connector, library, chainId, account, activate, deactivate, active, error } = context
  
  const gh = 'https://github.com/geist-org/react'
  const docs = 'https://react.geist-ui.dev'
  const redirect = (url: string) => {
    window.open(url)
  }

  React.useEffect((): any => {
    async function loadData() {
      if (!!library && account) {
        const response = await library.getTransactionCount(account)
        console.log(response)
      }
    }

    loadData()
  }, [library, chainId, account]) // ensures refresh if referential identity of library doesn't change across chainIds

  const router = useRouter()

  return (
    <div>
      <Head>
        <title> Cryptosource </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ position: 'absolute'}}>
        <Particles height="100vh" width="100vw" params={{
        background: {
          color: {
            value: "#d9e3f0",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 300,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: true,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 60,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
      }} />
      </div>
      <Page>
      <>
      
      <Breadcrumbs>
        <Breadcrumbs.Item onClick={() => router.push("/")}>Home</Breadcrumbs.Item>
      </Breadcrumbs>
     
        <h2> Web3 Community Insights</h2>
        <Card shadow onClick={() => router.push("/tokens")} hoverable>
  <h4>Token Communities </h4>
  <p> Explore the most popular contracts amongst a community of token holders. </p>
</Card>
<Button onClick={() => {
                activate(injected)
              }}> Injected </Button>

 </>
      </Page>
    </div>
  )
}


