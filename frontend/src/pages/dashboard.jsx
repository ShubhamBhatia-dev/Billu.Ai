import React from 'react'
import AgentChat from './agentchat'

export const Dashboard = () => {
    const name = localStorage.getItem("name")
  return (
    <div> Welcome {name} 
     <AgentChat></AgentChat></div>
   
  )
}
