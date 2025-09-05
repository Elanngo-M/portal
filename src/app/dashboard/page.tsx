"use client"
import { RootState } from '@/redux_files/state/store'
import React from 'react'
import { useSelector } from 'react-redux'

export default function Dashboard() {
  const { role }:any = useSelector((state: RootState) => state.userRole.userData?.role);
  return (
    <div>
        <p>Role:{role}</p>
      <p>DashBoard</p>
    </div>
  )
}
