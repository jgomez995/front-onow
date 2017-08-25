import React from 'react'
import Layout from './layout'
import axios from 'axios'
import { connect } from 'react-redux'
import { Tabs, TabLink, TabContent } from 'react-tabs-redux'
import { Modal, Input, notification, Spin } from 'antd'

const API_URL = 'http://localhost:8080/admin'

const openNotificationWithIcon = (type, msg) => {
  notification[type]({
    message: type.toUpperCase(),
    description: msg
  })
}
const dias = ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab']
class Entretenimiento extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props.route)
    this.showModal = this.showModal.bind(this)
    this.submitLocacion = this.submitLocacion.bind(this)
    this.submitActividad = this.submitActividad.bind(this)
    this.state = { actividades: [], locaciones: [], shows: [], actividadesModal: false, locacionModal: false, showModal: false, loading: true }
  }
  componentWillMount() {
    const _this = this
    let getActividades = () => axios.get(`${API_URL}/hoteles/${this.props.route.match.params.hotel}/1`)
    let getShows = () => axios.get(`${API_URL}/actividades`)
    let getHoteles = () => axios.get(`${API_URL}/hoteles`, { headers: { 'X-Auth': this.props.session.user.token } })
    axios.all([getActividades(), getShows(), getHoteles()])
      .then(axios.spread((actividades, shows, hoteles) => {
        let hotel = hoteles.data.filter(e => e.clave === this.props.route.match.params.hotel)
        this.setState({ actividades: actividades.data, shows: shows.data, hotel: hotel[0].id })
        return hotel[0].id
      }))
      .then(function (hotel) {
        console.log(hotel)
        axios.get(`${API_URL}/locaciones/${hotel}`).then(locaciones => {
          console.log(_this.state)
          _this.setState({ locaciones: locaciones.data, loading: false })
        })
      })
      .catch(function (e) {
        console.log(e.message)
        if (e.response.status === 404) {
          res.status(404).send('!Página no encontrada!')
        }
      })
  }
  update() {
    this.setState({ loading: true })
    let getActividades = () => axios.get(`${API_URL}/hoteles/${this.props.route.match.params.hotel}/1`)
    let getLocaciones = () => axios.get(`${API_URL}/locaciones/${this.state.hotel}`)
    let getShows = () => axios.get(`${API_URL}/actividades`)
    axios.all([getActividades(), getLocaciones(), getShows()])
      .then(axios.spread((actividades, locaciones, shows) => {
        this.setState({ actividades: actividades.data, locaciones: locaciones.data, shows: shows.data, actividadesModal: false, locacionModal: false, loading: false })
      }))
      .catch(function (e) {
        console.log(e.message)
        if (e.response.status === 404) {
          res.status(404).send('!Página no encontrada!')
        }
      })
  }
  showModal(modal) {
    this.setState({
      [modal]: true
    })
  }
  submitLocacion(e) {
    let rawInput = document.getElementById('locacionInput').value
    let input = rawInput.trim()
    const hotel = this.state.hotel
    const _this = this
    if (input.length > 0) {
      axios.post(`${API_URL}/locacion/agregar`, { locacion: input, hotel: hotel }, {
        headers: {
          'X-Auth': this.props.session.user.token
        }
      }).then(r => {
        if (r.data.error) {
          openNotificationWithIcon('error', r.data.error)
        } else {
          openNotificationWithIcon('success', r.data.success)
          _this.update()
        }
      }).catch(e => {
        openNotificationWithIcon('error', e.message)
      })
    }
  }
  submitActividad(e) {
    let rawInput = document.getElementById('actividadInput').value
    let input = rawInput.trim()
    const _this = this
    if (input.length > 0) {
      axios.post(`${API_URL}/actividad/agregar`, { actividad: input, categoria: 1 }, {
        headers: {
          'X-Auth': this.props.session.user.token
        }
      }).then(r => {
        if (r.data.error) {
          openNotificationWithIcon('error', r.data.error)
        } else {
          openNotificationWithIcon('success', r.data.success)
          _this.update()
        }
      }).catch(e => {
        openNotificationWithIcon('error', e.message)
      })
    }
  }
  component() {
    return (
      <article className='main__body'>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='return-button'>
              <a onClick={this.props.route.history.goBack} className='btn btn-return'><span className='fa fa-angle-left fa-fw' /></a>
              <h4>Hoteles</h4>
            </div>
          </div>
          <div className='col-xs-12'>

            <div id='tab-container' className='tab-container'>
              <Tabs>
                {/* <TabList className='etabs'> */}
                <ul className='etabs'>
                  <li className='tab'><TabLink to='listado' >Listado</TabLink></li>
                  <li className='tab'><TabLink to='categorias' >Categorias</TabLink></li>
                  <li className='tab'><TabLink to='locaciones' >Locaciones</TabLink></li>
                </ul>
                {/* </TabList> */}
                {/* <PanelContainer> */}
                <TabContent for='listado' >
                  <div id='listado'>
                    <h5 className='title'>Entretenimiento</h5>
                    <div className='add-promotion pull-right'>
                      <a href={`/${this.props.route.match.params.hotel}/agregarshow`} className='btn btn-success'><span className='fa fa-plus fa-fw' /></a>
                    </div>
                   <div className='clearfix' />
                    <Spin spinning={this.state.loading} size='large'>
                      <table className='table tables' data-page-length='7'>
                        <thead>
                          <tr>
                            <th>Nombre del show:</th>
                            <th>Locación</th>
                            <th>Dias activos</th>
                            <th>&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            this.state.actividades.map(a => (
                              <tr key={`actividad${a.evento_id}`}>
                                <td>{a.nombre}</td>
                                <td>{a.lugar}</td>
                                <td>{a.dias.map((dia, i) => i === a.dias.length - 1 ? `${dias[dia.dia]}` : `${dias[dia.dia]} - `)}</td>
                                <td><a href={`/${this.props.route.match.params.hotel}/editarShow/${a.evento_id}`} rel='modal:open' className='btn btn-edit'><i className='fa fa-pencil fa-fw' /></a><a href='' className='btn btn-trash'><i className='fa fa-trash fa-fw' /></a></td>
                              </tr>
                            ))
                          }

                        </tbody>
                      </table>
                    </Spin>
                  </div>
                </TabContent>
                <TabContent for='categorias' >
                  <div id='categorias'>
                    <h5 className='title'>Entretenimiento</h5>
                    <div className='add-promotion pull-right'>
                      <a onClick={() => this.showModal('actividadesModal')} rel='modal:open' className='btn btn-success open-popup-link'><span className='fa fa-plus fa-fw' /></a>
                    </div>
                    <div className='clearfix' />
                    <Spin spinning={this.state.loading} size='large'>
                      <table className='table tables' data-page-length='7'>
                        <thead>
                          <tr>
                            <th>Categorias (shows)</th>
                            <th>&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.shows.map(s => (
                              <tr key={`show${s.id}`}>
                                <td>{s.actividad}</td>
                                <td><a href='#edit-promo' rel='modal:open' className='btn btn-edit'><i className='fa fa-pencil fa-fw' /></a><a href='' className='btn btn-trash'><i className='fa fa-trash fa-fw' /></a></td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </Spin>
                  </div>
                </TabContent>
                <TabContent for='locaciones' >
                  <div id='locaciones'>
                    <h5 className='title'>Entretenimiento</h5>
                    <div className='add-promotion pull-right'>
                      <a onClick={() => this.showModal('locacionModal')} rel='modal:open' className='btn btn-success open-popup-link'><span className='fa fa-plus fa-fw' /></a>
                    </div>
                    <div className='clearfix' />
                    <Spin spinning={this.state.loading} size='large'>
                      <table className='table tables' data-page-length='7'>
                        <thead>
                          <tr>
                            <th>Locación:</th>
                            <th>&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.locaciones.map(l => (
                              <tr key={`locacion${l.id}`}>
                                <td>{l.locacion}</td>
                                <td><a href='#edit-promo' rel='modal:open' className='btn btn-edit'><i className='fa fa-pencil fa-fw' /></a><a href='' className='btn btn-trash'><i className='fa fa-trash fa-fw' /></a></td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </Spin>
                  </div>
                </TabContent>
              </Tabs>
            </div>
          </div>
        </div>
        <Modal
          title='Agregar Actividad'
          visible={this.state.actividadesModal}
          onOk={this.submitActividad}
          onCancel={() => this.setState({ actividadesModal: false })}
        >
          <Input id='actividadInput' size='large' placeholder='Actividad' />
        </Modal>
        <Modal
          title='Agregar Locación'
          visible={this.state.locacionModal}
          onOk={this.submitLocacion}
          onCancel={() => this.setState({ locacionModal: false })}
        >
          <Input id='locacionInput' size='large' placeholder='Locacion' />
        </Modal>
      </article>
    )
  }
  render() {
    return (
      <Layout component={this.component()} />
    )
  }
}
const mapStateToProps = (session, ownProps) => (session)
export default connect(mapStateToProps, null)(Entretenimiento)
