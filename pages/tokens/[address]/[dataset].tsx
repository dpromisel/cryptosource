import { Breadcrumbs, Button, Description, Loading, Page, Spacer, Table, Tabs, useToasts } from '@geist-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types'
import AWS, { S3 } from 'aws-sdk';
import { supabase } from '../../../utils/supabaseClient'
import { definitions } from '../../../types/supabase'
import BuildTable from '../../../components/BuildTable'

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

type CommunityDataset = {
    to: string;
    from: number;
    ContractName: string;
}[]

const getDataset = async (address: string, root: string, key: string): Promise<CommunityDataset> => {
    let dataset: CommunityDataset = []
    if (typeof address != 'string') {
        return dataset
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
        const objectParams: S3.GetObjectRequest = {
            Key : `${root}/${address}/${key}`,
            Bucket: 'canalytics'
        };
    
        const resp = await s3.getObject(objectParams).promise()
        
        if (resp && resp?.Body) {
            try {
                const data = JSON.parse(resp.Body.toString("utf-8"))
                if (data.length > slice) {
                    dataset = data.slice(0, slice)
                } else {
                    dataset = data
                }
            } catch(e) {
                console.log(e)
            }
        }
    } catch (e) {
        console.log(e)
    }

    return dataset
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {

  let token: Partial<definitions["tokens"]> = {
    symbol: '',
    name: '',
    address: '',
    website: ''
  }

  let dataset: Partial<definitions["datasets"]> = {}
  let communityDataset: CommunityDataset = []
  let builds: definitions["builds"][] = []

  if (context?.params?.dataset && typeof context.params.dataset == "string") {
    const { data: datasetsResp, error } = await supabase
        .from<definitions["datasets"]>('datasets')
        .select("*")
        .eq("relativeKey", context.params.dataset)

    if (datasetsResp && datasetsResp.length > 0) {
        dataset = datasetsResp[0]
    }
  }

  if (dataset && context?.params?.address && typeof context.params.address == "string" && dataset.rootKey && dataset.relativeKey) {
    communityDataset = await getDataset(context.params.address, dataset.rootKey, dataset.relativeKey)

    const { data: buildsResp } = await supabase
            .from<definitions["builds"]>('builds')
            .select("*, datasets ( name ) ")
            .eq("address", context.params.address)
            .eq("dataset", dataset.id)
  
    if (buildsResp) {
      builds = buildsResp
    }
  }
  
  return {
    props: {
        token: token,
        dataset,
        builds,
        communityDataset
    }
  }
}

const Token = ({ token, dataset, builds, communityDataset }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { address, dataset: datasetKey } = router.query


  return <div>
    <Head>
      <title> Tokens: {address} </title>
    </Head>
    <Page >
    <>
    <Breadcrumbs>
      <Breadcrumbs.Item onClick={() => router.push("/")}>Home</Breadcrumbs.Item>
      <Breadcrumbs.Item onClick={() => router.push("/tokens")}> Tokens </Breadcrumbs.Item>
      <Breadcrumbs.Item onClick={() => router.push(`/tokens/${address}/`)}> {address} </Breadcrumbs.Item>
      <Breadcrumbs.Item> {dataset ? dataset.name : datasetKey} </Breadcrumbs.Item>

    </Breadcrumbs>
    <>
          {dataset ? <>
          <Spacer h={1}/>

          <Description title="Name" content={dataset.name} />
          <Spacer h={1}/>

          <Description title="Description" content={dataset.description} />
          <Spacer h={1}/>

        </> : <p> No dataset found! </p>}

           <Tabs initialValue="1">
                <Tabs.Item label="Dataset" value="1">
                  {communityDataset && <TokenAggregateTable dataset={communityDataset} />}
                </Tabs.Item>
                <Tabs.Item label="Build History" value="2">
                    <BuildTable builds={builds} />
                </Tabs.Item>
              </Tabs>
      </>
    </>
    </Page>
  </div>
}

function TokenAggregateTable({ dataset } : { dataset: CommunityDataset }) {
  const renderAction: TableColumnRender<any> = (value, rowData, index) => {
    return (
      <Button auto scale={1/2} onClick={() => window.open(`https://etherscan.io/address/${rowData.to}`)}> View Address </Button>
    )
  }

  if (!dataset) return null
  return <Table data={dataset?.length ? dataset?.map(td => ({ ...td, etherscan: ""})) : []}>
    <Table.Column prop="to" label="to" />
    <Table.Column prop="from" label="from" />
    <Table.Column prop="ContractName" label="Contract Name" />
    <Table.Column prop="etherscan" label="Etherscan" render={renderAction} />
  </Table>
}

export default Token