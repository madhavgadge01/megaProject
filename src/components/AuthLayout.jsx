import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const authStatus = useSelector(state => state.auth.status)

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login")
    } else if (!authentication && authStatus) {
      navigate("/")
    }
    setLoading(false)
  }, [authStatus, authentication, navigate])

  if (loading) return <h1>Loading...</h1>

  return <>{children}</>
}