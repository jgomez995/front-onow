import React from 'react'
import { Menu, Dropdown, Icon } from 'antd';



const Header = (props) => {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="http://www.alipay.com/">Administradores</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="#" onClick={() => props.logout()}>Salir</a>
      </Menu.Item>
    </Menu>
  )
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
            <div className='menuDropit'>
              <div className='avatar-profile'>
                <img src={props.session.img} alt='profile' />
              </div>
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="name-profile ant-dropdown-link" href="#">
                  <span className='light'>Hola</span>, {props.session.nombre} {props.session.apellido} <Icon type="down" />
                </a>
              </Dropdown>
            </div>
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
