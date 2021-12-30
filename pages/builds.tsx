import { Breadcrumbs, Page } from '@geist-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import AWS, { S3 } from 'aws-sdk';
import { supabase } from '../utils/supabaseClient'
import { definitions } from '../types/supabase'
import BuildTable from '../components/BuildTable'


export const getStaticProps = async (context: GetStaticPropsContext) => {

  let builds: definitions["builds"][] = []

  
    const { data: buildsResp } = await supabase
            .from<definitions["builds"]>('builds')
            .select("*, datasets ( name, relativeKey ) ")
  
    if (buildsResp) {
      builds = buildsResp
    }
  
  
  return {
    props: {
        builds
    }
  }
}

const Builds = ({ builds }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()

  return <div>
    <Head>
      <title> Builds </title>
    </Head>
    <Page >
    <>
    <Breadcrumbs>
      <Breadcrumbs.Item onClick={() => router.push("/")}>Home</Breadcrumbs.Item>
      <Breadcrumbs.Item onClick={() => router.push("/builds")}> Builds </Breadcrumbs.Item>
    </Breadcrumbs>
          <> 
    <h2> Builds </h2>
           
                  <BuildTable builds={builds} showAddress />
        
      </>
    </>
    </Page>
  </div>
}


export default Builds