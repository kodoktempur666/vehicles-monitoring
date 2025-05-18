"use client"

import { TableHeader, TableRow, TableHead, Table, TableBody, TableCell } from '@/components/ui/table'
import { getHistory } from '@/lib/actions/booking'

import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Button } from '@/components/ui/button'

const Reports = () => {
  const [History, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      const data = await getHistory()
      setHistory(data)
      setLoading(false)
    }
    fetchHistory()
  }, [])

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      History.map(h => ({
        'Requester Name': h.requesterName,
        'Driver Name': h.driverName,
        'Reg Number': h.vehicleRegNumber,
        'Model': h.vehicleModel,
        'Destination': h.destinationName,
        'Distance': h.destinationDistance,
        'Start Date': new Date(h.startDate).toLocaleDateString(),
        'End Date': new Date(h.endDate).toLocaleDateString(),
        'Total Fuel': h.totalFuel,
        'Notes': h.notes
      }))
    );
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "History")
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'booking-history.xlsx')
  }

  return (
    <div className='w-full'>
      <div className='px-4 sm:px-6 lg:px-8 py-6'>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking History</h1>
          </div>
          <div>
            <Button onClick={handleExport}>Export to Excel</Button>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Req Name</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Reg Number</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Fuel</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableHead colSpan={9} className="text-center">
                  Loading...
                </TableHead>
              </TableRow>
            ) : (
              History.map((history) => (
                <TableRow key={history.id}>
                  <TableCell>{history.requesterName}</TableCell>
                  <TableCell>{history.driverName}</TableCell>
                  <TableCell>{history.vehicleRegNumber}</TableCell>
                  <TableCell>{history.vehicleModel}</TableCell>
                  <TableCell>{history.destinationName}</TableCell>
                  <TableCell>{history.destinationDistance}</TableCell>
                  <TableCell>{new Date(history.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(history.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{history.totalFuel}</TableCell>
                  <TableCell>{history.notes}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Reports
