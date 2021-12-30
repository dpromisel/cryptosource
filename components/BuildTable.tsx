import { Table } from '@geist-ui/react'
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types'
import { useRouter } from 'next/router'
import { definitions } from '../types/supabase'


function BuildTable({ builds, showAddress } : { builds: definitions["builds"][], showAddress?: boolean }) {
    const router = useRouter()
  const renderDatasetName: TableColumnRender<any> = (value, rowData, index) => {
    return (
      <p> {rowData["datasets"]["name"]} </p>
    )
  }

  return <Table data={builds?.length ? builds : []} onRow={(row: any) => {
      if (showAddress) {
        router.push(`/tokens/${row.address}/${row["datasets"]["relativeKey"]}`)
      }
  }}>
    {showAddress && <Table.Column prop="address" label="Address" />}
    <Table.Column prop="datasets" label="Dataset" render={renderDatasetName} />
    <Table.Column prop="status" label="Status" />
    <Table.Column prop="submitted" label="Submitted at" />
    <Table.Column prop="finished" label="Finished at" />
    <Table.Column prop="api_requests" label="Cost" />
  </Table>
}

export default BuildTable