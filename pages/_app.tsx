import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline, GeistProvider } from '@geist-ui/react'
import Particles from 'react-tsparticles'

function MyApp({ Component, pageProps }: AppProps) {
  return <GeistProvider>

    <CssBaseline />
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
    <Component {...pageProps} />
  </GeistProvider>
}

export default MyApp
