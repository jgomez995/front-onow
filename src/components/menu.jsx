import React from 'react'
import {push} from 'react-router-redux'
const Menu = (props) => {
  return (
    <article className='main__menu'>
      <div className='menu'>
        <ul className='navegador'>
          <li className='selected'><a href='#' className='desplegable' title='Hoteles'><i className='fa fa-mobile-phone fa-fw' />App O-NOW</a>
            <ul className='subnavegador'>
              <li><a href='/entretenimiento' className='sub-item'>Entretenimiento</a></li>
              {/* <li><a href='eventos.html' className='sub-item'>Eventos</a></li> */}
            </ul>
          </li>
        </ul>
      </div>
    </article>
  )
}
export default Menu
