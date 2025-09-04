import React, { useState } from 'react'

export const GlobalFilter = ({ filter, setFilter }) => {
  
  return (
      <input
        value={filter || ''}
        onChange={e => setFilter(e.target.value)}
      />
  )
}