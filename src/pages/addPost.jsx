import React from 'react'
import { Container, PostForm } from '../components'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AddPost() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!authStatus) {
      navigate('/login')
    }
  }, [authStatus, navigate])

  return (
    <div className='py-8'>
        <Container>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost