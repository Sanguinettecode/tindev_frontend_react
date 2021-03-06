import React, { useState } from 'react';
import Service from '../services/api';
import logo from '../assets/logo.svg'
import './login.css'

export default function Login({ history }) {
  const [username, setUsername] = useState('');
  async function handleSubmit(e) {
    e.preventDefault();

    const response = await Service.post('/dev', {
      username,
    }) 
    
    const { _id } = response.data;

    history.push(`/dev/${_id}`)

  }
  return(
    <div className="login-container">
     
      <form onSubmit={handleSubmit}>
      <img src={logo} alt="tindev" />
        <input 
          placeholder="Digite seu usuário do Github"
          value={username}
          onChange={ e => setUsername(e.target.value) }
        />
        <button>Login</button>
      </form>
    </div>
  )
}