import MaintenanceForm from '@/components/admin/MaintenanceForm'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Maintenance = () => {
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/managements">Go Back</Link>

      </Button>
      <section className='w-full max-w-2xl'>
        <MaintenanceForm
            vehicleId=""
            date={new Date()}
            notes=""
            status={false}
        />
      </section>
    </>
  )
}

export default Maintenance