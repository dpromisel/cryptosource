import Head from 'next/head'
import { Page, Breadcrumbs, Table, useModal, Button, Modal, Spacer, Input } from '@geist-ui/react'
import { useRouter } from 'next/router';
import { InferGetStaticPropsType } from 'next'
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import { supabase } from '../utils/supabaseClient';
import { definitions } from "../types/supabase";
import { useState } from 'react';

export default function NewToken() {
    const router = useRouter()
    const { visible, setVisible, bindings } = useModal()

    const [newToken, setNewToken] = useState<Partial<definitions["tokens"]>>({
        address: '',
        website: '',
        symbol: '',
        name: ''
    })
    
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }

    async function updateState(prop: keyof definitions["tokens"], value: any) {
        console.log(prop, value)
        const newState = { ...newToken }
        newState[prop] = value
        setNewToken(newState)
    }

    async function handleSubmit(token: Partial<definitions["tokens"]>) {
        const res = await supabase.from<definitions["tokens"]>("tokens").insert(token)
        // Check that our status code is in the 200s,
        // meaning the request was successful.
        if (res.status < 300) {
            refreshData();
        }

        setVisible(false)
    }

  return (
    <div>
        <Button auto onClick={() => setVisible(true)}> Index New Token </Button>
        <Spacer h={2} />
        <Modal {...bindings}>
        <Modal.Title> New Token </Modal.Title>
        <Modal.Subtitle> Request a token to be indexed  </Modal.Subtitle>
        <Modal.Content>
            <Input width="100%" placeholder="Token Address" onChange={e => updateState("address", e.target.value)}/>
            <Spacer h={1} />
            <Input width="100%" placeholder="Token Name" onChange={e => updateState("name", e.target.value)}/>
            <Spacer h={1} />
            <Input width="100%" placeholder="Token Website" onChange={e => updateState("website", e.target.value)}/>
            <Spacer h={1} />
            <Input width="100%" placeholder="Token Symbol" onChange={e => updateState("symbol", e.target.value)}/>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action onClick={() => handleSubmit({ ...newToken })}>Submit</Modal.Action>
      </Modal>
    </div>
  )
}