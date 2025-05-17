import VehicleForm from '@/components/admin/VehicleForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NewCar = () => {
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/managements">Go Back</Link>

      </Button>
      <section className='w-full max-w-2xl'>
        <VehicleForm
          model=""
          regNumber=""
          type=""
          fuelConsumption={0}
          status=""
        />
      </section>
    </>
  )
}

export default NewCar