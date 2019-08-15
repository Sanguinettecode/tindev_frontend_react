import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Main.css';
import Service from '../services/api';
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'

export default function Main({ match }){
  const [users, setUsers] = useState([])
  const [matchDev, setMatchDev] = useState(null)
  
  useEffect(() => {
    async function loadDevs() {
       const response = await Service.get('/dev', {
         headers: {user: match.params.id}
       })

       setUsers(response.data);
    }
    loadDevs();
  }, [match.params.id])

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: {user: match.params.id}
    });
    socket.on('match', dev => {
      setMatchDev(dev)
    })
  },[match.params.id])

  async function handlerDislikes(id) {
    await Service.post(`/dev/${id}/dislike`,null, {
      headers:{
        user: match.params.id,
      }
    })
    setUsers(users.filter( user => user._id !== id))
  }
  async function handlerLikes(id) {
    await Service.post(`/dev/${id}/like`,null, {
      headers:{
        user: match.params.id,
      }
    })
    setUsers(users.filter( user => user._id !== id))
  }

  return (
    <div className="main-container">
    <Link to="/">
      <img src={logo} alt="tindev" />
    </Link>
      {users.length > 0 ? (
        <ul>
        {users.map( user => {
            return(
              <li key={user._id}>
                <img src={user.avatar} alt="imagem desenvolvedor" />
                <footer>
                  <strong>{user.name}</strong>
                  <p>{user.bio}</p>  
                </footer>  
                <div className="buttons">
                  <button type="button" onClick={() => {handlerDislikes(user._id)}}  ><img src={dislike} alt="like" /></button>
                  <button type="button" onClick={() => {handlerLikes(user._id)}} ><img src={like} alt="dislike" /></button>
                </div>
              </li>
            )
        })}       
      </ul>
      ) : (
        <div className="empty">
          Acabou :(
        </div>
      )}

      { matchDev  && (
        <div className="match-container">
          <h2>Its a Match</h2>
          <img src={matchDev.avatar} />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
      )}
    </div>
  )
}