import BookingForm from '@/components/admin/BookingForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NewBooking = () => {
  return (
    <>
        <Button asChild className="back-btn">
          <Link href="/bookings">Go Back</Link>
        </Button>
        <section>
            <BookingForm
                vehicleId=""
                driverId=""
                approver1Id=''
                approver2Id=""
                notes=""
                status="pending"
                distance={0}
                date={new Date()}
                destinationId=""
                createdAt={new Date()}
            />
        </section>
    </>
  )
}

export default NewBooking