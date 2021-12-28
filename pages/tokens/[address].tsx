import { Breadcrumbs, Button, Description, Loading, Page, Spacer, Table, Tabs } from '@geist-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { getTokenData, TokenData } from '../api/tokens/[address]'
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types'

export async function getStaticPaths() {
  return {
    paths: [
      { params: { address: '' } },
    ],
    fallback: true
  };
}


export const getStaticProps = async (context: GetStaticPropsContext) => {
  const tokens: {
      [address: string]: {
              symbol: string;
              name: string;
              address: string;
              website: string;
      }
  } = {
      "0xCCac1187F4439E6ff02De97B16fF40BD2E7c8080": {
              symbol: "$ZERO",
              name: "Mad Realities: Season Zero",
              address: "0xCCac1187F4439E6ff02De97B16fF40BD2E7c8080",
              website: "https://www.madrealities.xyz/"
      },
      "0x5d1E816D60E42E5f8849eC802d5a4C9c48e662aA": {
              symbol: "SASSY",
              name: "SassyBlack",
              address: "0x5d1E816D60E42E5f8849eC802d5a4C9c48e662aA",
              website: "https://www.sound.xyz/sassyblack"
      },
      "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03": {
              symbol: "NOUN",
              name: "Nouns",
              address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
              website: "https://nouns.wtf/"
      },
      "0xeaCa6dc08AFf2694366c4405724973e2Ac7E49E9": {
              symbol: "Giraffage",
              name: "Giraffage",
              address: "0xeaCa6dc08AFf2694366c4405724973e2Ac7E49E9",
              website: "https://www.sound.xyz/giraffage"
      },
      "0xBF0631a1d679D36f51D0edCaBc06842679053ae5": {
              symbol: "BESTIES",
              name: "Crypto Besties",
              address: "0xBF0631a1d679D36f51D0edCaBc06842679053ae5",
              website: "https://linktr.ee/Cryptobesties"
      },
      "0x622236bb180256b6ae1a935dae08dc0356141632": {
              symbol: "WRITE",
              name: "Mirror Write Token",
              address: "0x622236bb180256b6ae1a935dae08dc0356141632",
              website: "https://mirror.xyz/"
      },
      "0x9e04f519b094f5f8210441e285f603f4d2b50084": {
              symbol: "$1EARTH",
              name: "Earth Fund",
              address: "0x9e04f519b094f5f8210441e285f603f4d2b50084",
              website: "https://www.earthfund.io/"
      }
  }

  let token: {
    symbol: string;
    name: string;
    address: string;
    website: string;
} = {
    symbol: '',
    name: '',
    address: '',
    website: ''
  }

  if (context?.params?.address && typeof context.params.address == "string") {
    token = tokens[context.params.address]
  }

  const tokenData = await getTokenData(context?.params?.address)
  
  return {
    props: {
        token: token,
        ...tokenData
    }
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const Token = ({ token, uniqueSenders, repeatSenders }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const { address } = router.query
  return <div>
    <Head>
      <title> Tokens: {address} </title>
    </Head>
    <Page >
    <>
    <Breadcrumbs>
      <Breadcrumbs.Item>Home</Breadcrumbs.Item>
      <Breadcrumbs.Item> <Link href={"/tokens"}> Tokens </Link></Breadcrumbs.Item>
      <Breadcrumbs.Item> {address} </Breadcrumbs.Item>
    </Breadcrumbs>
          <> 
            <h2>Token</h2>
            <h3> {address} </h3>
            {token ? <> 
              <Description title="Symbol" content={token.symbol} />
              <Spacer h={1}/>

              <Description title="Name" content={token.name} />
              <Spacer h={1}/>

              <Description title="Website" content={<a href={token.website} target="_blank"> {token.website}</a>} />
              <Spacer h={1}/>

              <Description title={<a href={`https://etherscan.io/token/${address}`} target="_blank"> Etherscan </a>} />
              <Spacer h={2}/>

            </> : <p> No token data </p> }

              
              <Tabs initialValue="1">
                <Tabs.Item label="Unique Senders" value="1">
                  <TokenAggregateTable tokenData={uniqueSenders} />
                </Tabs.Item>
                <Tabs.Item label="Repeat Senders" value="2">
                <TokenAggregateTable tokenData={repeatSenders} />
                </Tabs.Item>
              </Tabs>
      </>
    </>
    </Page>
  </div>
}

function TokenAggregateTable({ tokenData } : { tokenData: TokenData['repeatSenders']}) {
  const renderAction: TableColumnRender<TokenData['repeatSenders'][0]> = (value, rowData, index) => {
    return (
      <Button auto scale={1/2} onClick={() => window.open(`https://etherscan.io/address/${rowData.to}`)}> View Address </Button>
    )
  }

      return <Table data={tokenData as any}>
      <Table.Column prop="to" label="to" />
      <Table.Column prop="from" label="from" />
      <Table.Column prop="ContractName" label="Contract Name" />
      <Table.Column prop="etherscan" label="Etherscan" render={renderAction} />
      </Table>
}

export default Token