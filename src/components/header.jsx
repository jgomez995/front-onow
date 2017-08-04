import React from 'react'

const Header = (props) => {
  return (
    <header className='header'>
      <div className='header__brand' />
      <div className='header__nav container'>
        <div className='row'>
          <div className='col-xs-6 header__nav--title'>
            <h3><span className='fa fa-gear fa-fw' /> Backend</h3>
            <h3><small>Sistema Administrador de Recursos</small></h3>
          </div>
          <div className='col-xs-6 header__nav--menu'>
            <ul className='menuDropit'>
              <li>
                <div className='avatar-profile'>
                  <img src='/images/avatar/avatar.png' alt='profile' />
                </div>
                <a href='#' className='name-profile'><span className='light'>Hola</span>,mi Nombre<i className='fa fa-caret-down' /></a>
                <ul>
                  <li><a href='#'>Reportar Fallo</a></li>
                  <li><a href='#'>Administradores</a></li>
                  <li><a href='<?=base_url()?>logout'>Salir</a></li>
                </ul>
              </li>
            </ul>
          </div>
          <div className='col-xs-12 header__nav--breadcrumb'>
            <div className='breadcrumb'>
              <h3><span className='fa fa-mobile-phone' /> Oasis O-NOW</h3>
            </div>
          </div>
        </div>
      </div>
      <div className='clearfix' />
    </header>
  )
}
export default Header
