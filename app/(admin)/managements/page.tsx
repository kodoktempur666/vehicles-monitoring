"use client"

import { use, useEffect, useState } from "react"
import { Car, Filter, Fuel, Plus, Search, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from '@/components/ui/badge'
import { getMaintenance, getVehicles, maintenanceStatus } from "@/lib/actions/vehicle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link";
import { useRouter } from "next/navigation"

const Management = () => {
  const [vehiclesData, setVehiclesData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [maintenanceData, setMaintenance] = useState([])
  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles()
      setVehiclesData(data)
    }
    fetchVehicles()
  }, [])

  useEffect(() => {
    const fetchMaintenance = async () => {
      const data = await getMaintenance()
      setMaintenance(data)
    }
    fetchMaintenance()
  }, [])

  const handleMaintenance = async (vehicleId: string) => {
    const res = await maintenanceStatus(vehicleId);

    if (res.success) {
      console.log("Maintenance status updated successfully");

      // Refresh hanya data maintenance saja
      const updatedMaintenance = await getMaintenance();
      setMaintenance(updatedMaintenance);
    } else {
      console.error("Failed to update maintenance status");
    }
  };


  const filteredVehicles = vehiclesData.filter((vehicle) => {
    const term = searchTerm.toLowerCase()
    if (
      searchTerm &&
      !vehicle.regNumber.toLowerCase().includes(term) &&
      !vehicle.model.toLowerCase().includes(term)
    ) return false

    if (typeFilter !== "all" && vehicle.type !== typeFilter) return false
    if (statusFilter !== "all" && vehicle.status !== statusFilter) return false

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Available</Badge>
      case "in_use":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Use</Badge>
      case "maintenance":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Maintenance</Badge>
      case "approval_pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Approval Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
            <p className="text-muted-foreground">Manage and monitor all company vehicles</p>
          </div>

        </div>

        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="vehicles">
              <Car className="mr-2 h-4 w-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Truck className="mr-2 h-4 w-4" />
              Maintenance Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Fleet</CardTitle>
                <div className="flex justify-end mb-4">
                  <Button>
                    <Link href="/managements/new-vehicle" >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vehicle
                    </Link>

                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search vehicles..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="passenger">Passenger</SelectItem>
                        <SelectItem value="cargo">Cargo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in_use">In Use</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Registration</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Fuel Consumption</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVehicles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No vehicles found matching the selected filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell className="font-medium">{vehicle.regNumber}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {vehicle.type === "passenger" ? (
                                  <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                                )}
                                <span>{vehicle.model}</span>
                              </div>
                            </TableCell>
                            <TableCell>{vehicle.type === "passenger" ? "Passenger" : "Cargo"}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Fuel className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{vehicle.fuelConsumption}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>

              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
                <div className="flex justify-end mb-4">
                  <Button>
                    <Link href="/managements/new-maintenance" >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Maintenance
                    </Link>

                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Registration Number</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Schedule Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No maintenance records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        maintenanceData.map((maintenance) => (
                          <TableRow key={maintenance.maintenance.id}>
                            <TableCell className="font-medium">{maintenance.vehicles.regNumber}</TableCell>
                            <TableCell>{maintenance.vehicles.model}</TableCell>
                            <TableCell>{maintenance.maintenance.scheduledDate}</TableCell>
                            <TableCell>{maintenance.maintenance.status ? "Process" : "Completed"}</TableCell>
                            <TableCell>{maintenance.maintenance.notes}</TableCell>
                            <TableCell>
                              <Button

                                onClick={() => handleMaintenance(maintenance.maintenance.id)} className={maintenance.maintenance.status ? "bg-green-500" : "hidden"}>


                                Done
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Management