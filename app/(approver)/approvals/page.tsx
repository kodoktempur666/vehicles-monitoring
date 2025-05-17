"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserRole } from '@/lib/actions/auth';
import { getBookings, updateBookingLevel1, updateBookingLevel2 } from '@/lib/actions/booking';
import React from 'react';

const Manager = () => {
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [role, setRole] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);


  React.useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const data = await getBookings();
      const userRole = await getUserRole();
      setRole(userRole);

      let filtered = [];

      if (userRole === 'approver_l1') {
        filtered = data.filter((b: any) => b.bookings.status === 'pending');
      } else if (userRole === 'approver_l2') {
        filtered = data.filter((b: any) => b.bookings.status === 'approved_lv1');
      } else {
        filtered = data;
      }

      setBookings(filtered);
      setLoading(false);
    };

    fetchBookings();
  }, []);


  const handleApproval1 = async () => {
    const res = await updateBookingLevel1(bookings[0].bookings.id);
    if (res.success) {
      console.log(res.data);

      window.location.reload();
    } else {
      console.error(res.message);
    }
  }

  const handleApproval2 = async (id: string) => {
    const res = await updateBookingLevel2(id);
    if (res.success) {
      console.log(res.data);
      window.location.reload();
    } else {
      console.error(res.message);
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved_lv1":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Approved lv 1</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className='w-full'>
      <div className='px-4 sm:px-6 lg:px-8 py-6'>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking Approvals</h1>
            <p className="text-muted-foreground">Manage and approve vehicle bookings</p>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {role === 'approver_l1'
                      ? 'No pending bookings found'
                      : role === 'approver_l2'
                        ? 'No level 1 approved bookings found'
                        : 'No bookings found'}
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking: any) => (
                  <TableRow key={booking.bookings.id}>
                    <TableCell>{booking.destinations.name}</TableCell>
                    <TableCell>{booking.vehicles.regNumber}</TableCell>
                    <TableCell>{booking.drivers.name}</TableCell>
                    <TableCell>{new Date(booking.bookings.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.bookings.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(booking.bookings.status)}</TableCell>
                    <TableCell className="text-right">
                      {role === 'approver_l1' && booking.bookings.status === 'pending' ? (
                        <Button onClick={() => handleApproval1(booking.bookings.id)}>Approve (Level 1)</Button>
                      ) : role === 'approver_l2' && booking.bookings.status === 'approved_lv1' ? (
                        <Button onClick={() => handleApproval2(booking.bookings.id)}>Approve (Level 2)</Button>
                      ) : (
                        <Button disabled>Action</Button>
                      )}

                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Manager;
