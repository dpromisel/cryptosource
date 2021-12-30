import Head from 'next/head'
import { Page, Breadcrumbs, Table, useModal, Button, Modal, Spacer, Input } from '@geist-ui/react'
import { useRouter } from 'next/router';
import { InferGetServerSidePropsType } from 'next'
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import { supabase } from '../utils/supabaseClient';
import { definitions } from "../types/supabase";
import NewToken from '../components/NewToken';

export const getServerSideProps = async () => {
    let { data: tokens, error } = await supabase
            .from<definitions["tokens"]>('tokens')
            .select("*")

    if (tokens) {
        return {
            props: {
                tokens
            },
          }
    } else {
        return {
            props: {
                tokens: []
            },
        }
    }
}

export default function Tokens({ tokens }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()

    if (!tokens) {
        return <> Loading...</>
    }

    const data = Object.values(tokens)
  
    const renderSite: TableColumnRender<any> = (value, rowData, index) => {
        return (
            <a href={value} target="_blank" rel="noreferrer"> {value}</a>
        )
      }

  return (
    <div>
      <Head>
        <title> Tokens </title>
      </Head>
      <Page >
      <>
      <Breadcrumbs>
        <Breadcrumbs.Item onClick={() => router.push("/")}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item onClick={() => router.push("/tokens")}>Tokens</Breadcrumbs.Item>
      </Breadcrumbs>
        <h2>Tokens</h2>
        <NewToken />
        <Table data={data} onRow={row => router.push(`/tokens/${row.address}`)}>
        <Table.Column prop="symbol" label="symbol" />
        <Table.Column prop="name" label="name" />
        <Table.Column prop="address" label="address" />
        <Table.Column prop="website" label="website" render={renderSite} />
      </Table>
      </>
      </Page>
    </div>
  )
}