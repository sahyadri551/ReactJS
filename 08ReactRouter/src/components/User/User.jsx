import React from 'react'
import { useParams } from 'react-router-dom'

function User() {
    const { id } = useParams();
    return (
        <div className='text-center bg-amber-200 text-3xl text-blue-800'>User: {id}</div>
    )
}

export default User
