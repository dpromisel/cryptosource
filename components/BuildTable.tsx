import { Table } from '@geist-ui/react'
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types'
import { definitions } from '../types/supabase'


function BuildTable({ builds } : { builds: definitions["builds"][] }) {
  const renderDatasetName: TableColumnRender<any> = (value, rowData, index) => {
    return (
      <p> {rowData["datasets"]["name"]} </p>
    )
  }

  return <Table data={builds?.length ? builds : []}>
    <Table.Column prop="datasets" label="Dataset" render={renderDatasetName} />
    <Table.Column prop="status" label="Status" />
    <Table.Column prop="submitted" label="Submitted at" />
    <Table.Column prop="finished" label="Finished at" />
    <Table.Column prop="api_requests" label="Cost" />
  </Table>
}

export default BuildTable