'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getBookings, getHistory } from "@/lib/actions/booking"
import { Car, CheckCircle, Clock, CalendarClock } from "lucide-react"
import { useEffect, useState } from "react"

export default function Page() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    inProgressBookings: 0,
    pendingBookings: 0,

  })

  const [fuelConsumption, setFuelConsumption] = useState(0)

  useEffect(() => {
  const fetchBookings = async () => {
    const data = await getBookings()
    setStats({
      totalBookings: data.length,
      completedBookings: data.filter((b) => b.bookings.status === "completed").length,
      inProgressBookings: data.filter((b) => b.bookings.status === "approved").length,
      pendingBookings: data.filter((b) => b.bookings.status === "pending").length,
    })

    const fuelData = await getHistory()

    // Hitung total fuel dalam 30 hari terakhir
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const totalFuelLast30Days = fuelData
      .filter((item) => {
        const createdAt = new Date(item.createdAt)
        return createdAt >= thirtyDaysAgo && createdAt <= now
      })
      .reduce((sum, item) => sum + item.totalFuel, 0)

    setFuelConsumption(totalFuelLast30Days)
  }

  fetchBookings()
}, [])



  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of vehicle bookings and usage statistics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">All vehicle bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
              <p className="text-xs text-muted-foreground">Completed bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressBookings}</div>
              <p className="text-xs text-muted-foreground">Currently active bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Fuel Consumption in 30 days</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fuelConsumption}</div>
              <p className="text-xs text-muted-foreground">Liters</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
