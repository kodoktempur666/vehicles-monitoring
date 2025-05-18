"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Calendar, Car, Filter, MoreHorizontal, Plus, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { completeBooking, getBookings } from "@/lib/actions/booking"
// import { BookingDialog } from "@/components/booking-dialog"

const Bookings = () => {
  const [bookings, setBookings] = useState([])


  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getBookings()
      setBookings(data)
    }
    fetchBookings()
  }, [])

  const handleBooking = async (id: string) => {
    const res = await completeBooking(id)

    if (res.success) {
      console.log(res.data)
      const updatedBookings = await getBookings()
      setBookings(updatedBookings)
    } else {
      console.error(res.message)
    }
  }



  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-800 text-white">
            Pending
          </Badge>
        )
      case "approved_lv1":
        return (
          <Badge variant="outline" className="bg-blue-800 text-white">
            Approved lv 1
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-purple-800 text-white">
            Approved
          </Badge>
        )
      

      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline" className="bg-green-600 text-white">{status}</Badge>
    }
  }
  return (
    <div className='w-full'>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Bookings</h1>
            <p className="text-muted-foreground">Manage and track all vehicle booking requests</p>
          </div>

          <Button >
            <Link href="/bookings/new-bookings" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>

          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead>Vehicle Registration</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.bookings.id}>
                  <TableCell>
                    <span>{booking.destinations.name}</span>
                  </TableCell>
                  <TableCell>{booking.vehicles.regNumber}</TableCell>
                  <TableCell>{booking.drivers.name}</TableCell>
                  <TableCell>{new Date(booking.bookings.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.bookings.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(booking.bookings.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      {/* <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link >
                          <DropdownMenuItem>View</DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent> */}
                    </DropdownMenu>
                    <Button
                      onClick={() => handleBooking(booking.bookings.id)}
                      className={booking.bookings.status === "approved" ? "" : "hidden"}
                    >
                      Complete
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  )
}

export default Bookings