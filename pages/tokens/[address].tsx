import { Breadcrumbs, Button, Description, Loading, Page, Spacer, Table, Tabs, useToasts } from '@geist-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types'
import AWS, { S3 } from 'aws-sdk';
import { Readable } from "stream";
import { supabase } from '../../utils/supabaseClient'
import { definitions } from '../../types/supabase'
import BuildTable from '../../components/BuildTable'

export type TokenData = {
  uniqueSenders: {
      to: string;
      from: number;
      ContractName: string;
  }[]

  repeatSenders: {
      to: string;
      from: number;
      ContractName: string;
  }[]
}

export const getTokenData = async (address: any): Promise<TokenData> => {
  const tokenData: TokenData = {
      uniqueSenders: [],
      repeatSenders: []
  }

  if (typeof address != 'string') {
      return tokenData
  }

  if (process.env.AWS_ACCESS_KEY_ID_CRYPTOSOURCE && process.env.AWS_ACCESS_SECRET_CRYPTOSOURCE) {
    AWS.config.update({
        "accessKeyId": process.env.AWS_ACCESS_KEY_ID_CRYPTOSOURCE,
        "secretAccessKey":process.env.AWS_ACCESS_SECRET_CRYPTOSOURCE
    });
}

  const s3 = new S3({apiVersion: '2006-03-01'});
  const slice = 100

  try {
      const uniqObjectParams: S3.GetObjectRequest = {
          Key : `dev0/tokens/${address}/uniq`,
          Bucket: 'canalytics'
      };
  
      const uniqResp = await s3.getObject(uniqObjectParams).promise()
      
      if (uniqResp && uniqResp?.Body) {
          try {
              const data = JSON.parse(uniqResp.Body.toString("utf-8"))
              if (data.length > slice) {
                  tokenData.uniqueSenders = data.slice(0, slice)
              } else {
                  tokenData.uniqueSenders = data
              }
          } catch(e) {
              console.log(e)
          }
      }
  } catch (e) {
      console.log(e)
  }

  try {
      const allObjectParams: S3.GetObjectRequest = {
          Key : `dev0/tokens/${address}/all`,
          Bucket: 'canalytics'
      };
  
      const allResp = await s3.getObject(allObjectParams).promise()
      
      if (allResp && allResp?.Body) {
          try {
              const data = JSON.parse(allResp.Body.toString("utf-8"))
              if (data.length > slice) {
                  tokenData.repeatSenders = data.slice(0, slice)
              } else {
                  tokenData.repeatSenders = data
              }            
          } catch(e) {
              console.log(e)
          }
      }
  } catch (e) {
      console.log(e)
  }

  return tokenData
}

export async function getStaticPaths() {
  const { data: tokensAddresses, error } = await supabase
            .from<definitions["tokens"]>('tokens')
            .select("address")

  let paths: any = [];
  if (tokensAddresses && tokensAddresses.length) {
    paths = tokensAddresses.map(token => {
      return {
        params: {
          address: token.address
        }
      }
    });
  }
  
    return {
      paths: paths,
      fallback: true
    };  
}


export const getStaticProps = async (context: GetStaticPropsContext) => {

  let token: Partial<definitions["tokens"]> = {
    symbol: '',
    name: '',
    address: '',
    website: ''
  }

  let datasets: definitions["datasets"][] = []
  let builds: definitions["builds"][] = []

  if (context?.params?.address && typeof context.params.address == "string") {
    const { data: tokens, error } = await supabase
            .from<definitions["tokens"]>('tokens')
            .select("*")
            .eq("address", context.params.address)

    if (tokens && tokens.length > 0) {
      token = tokens[0]
    }

    const { data: buildsResp } = await supabase
            .from<definitions["builds"]>('builds')
            .select("*, datasets ( name ) ")
            .eq("address", context.params.address)
  
    if (buildsResp) {
      builds = buildsResp
    }
  }

  const { data: datasetsResp, error } = await supabase
            .from<definitions["datasets"]>('datasets')
            .select("*")
  
  if (datasetsResp) {
    datasets = datasetsResp
  }

  // const tokenData = await getTokenData(context?.params?.address)
  
  return {
    props: {
        token: token,
        datasets,
        builds
    }
  }
}

const Token = ({ token, datasets, builds }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const { address } = router.query

  return <div>
    <Head>
      <title> Tokens: {address} </title>
    </Head>
    <Page >
    <>
    <Breadcrumbs>
      <Breadcrumbs.Item onClick={() => router.push("/")}>Home</Breadcrumbs.Item>
      <Breadcrumbs.Item onClick={() => router.push("/tokens")}> Tokens </Breadcrumbs.Item>
      <Breadcrumbs.Item> {address} </Breadcrumbs.Item>
    </Breadcrumbs>
          <> 
            <h2>{token.name}</h2>
            {token ? <> 
              <Description title="Symbol" content={token.symbol} />
              <Spacer h={1}/>

              <Description title="Name" content={token.name} />
              <Spacer h={1}/>

              <Description title="Website" content={<a href={token.website} target="_blank" rel="noreferrer"> {token.website}</a>} />
              <Spacer h={1}/>

              <Description 
                title="Etherscan" 
                content={<a href={`https://etherscan.io/token/${address}`} target="_blank" rel="noreferrer"> {address} </a>}
                />
              <Spacer h={2}/>

            </> : <p> No token data </p> }


              
              <Tabs initialValue="1">
                <Tabs.Item label="Token Datasets" value="1">
                  <TokenDatasetsTable datasets={datasets} />
                </Tabs.Item>
                <Tabs.Item label="Token Build History" value="2">
                  <BuildTable builds={builds} />
                </Tabs.Item>
              </Tabs>
      </>
    </>
    </Page>
  </div>
}

function TokenDatasetsTable({ datasets } : { datasets: definitions["datasets"][] }) {
  const router = useRouter()
  const { address } = router.query
  const [, setToast] = useToasts()


  const refreshData = () => {
    router.replace(router.asPath);
  }

  async function requestBuild(build: Partial<definitions["builds"]>) {
    if (build.address) {
      const { data } = await supabase.from<definitions["builds"]>("builds")
        .select("*")
        .eq("address", build.address)
        .eq("status", "Requested")
        .eq("dataset", build.dataset)

      if (data && data.length > 0) {
        setToast({
          text: 'This build has already been requested.',
          type: "default",
        })
      } else {
        const res = await supabase.from<definitions["builds"]>("builds").insert(build)
        // Check that our status code is in the 200s,
        // meaning the request was successful.
        if (res.status < 300) {
            refreshData();
        }
      }
    }
  }

  const requestBuildAction: TableColumnRender<definitions["builds"]> = (value, dataset, index) => {
    return (
      <Button auto scale={1/2} onClick={() => {
        if (address && typeof address == 'string') {
          requestBuild({
            dataset: dataset["id"],
            address,
            status: "Requested"
          })}
        }
      }> Request Build </Button>
    )
  }

  return <Table data={datasets?.length ? datasets : []} onRow={row => router.push(`/tokens/${address}/${row.relativeKey}`)}>
    <Table.Column prop="name" label="Name" />
    <Table.Column prop="description" label="Description" />
    <Table.Column prop="id" label="Request Build" render={requestBuildAction} />
  </Table>
}

export default Token