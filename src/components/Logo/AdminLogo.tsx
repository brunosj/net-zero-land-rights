'use client'

import React from 'react'
import Image from 'next/image'
import Logo from '@/assets/logo_light-green.svg'

const AdminLogo = () => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <Image alt="Net Zero Logo" width={800} decoding="async" src={Logo} />
  )
}

export default AdminLogo
