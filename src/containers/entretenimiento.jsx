import React from 'react'
import Layout from './layout'
import axios from 'axios'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

const API_URL = 'http://localhost:8080/admin'

class Entretenimiento extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props.route)
    this.state = { actividades: [], locaciones: [], shows: [] }
  }
  componentWillMount() {
    console.log(this.props.id)
    let getActividades = () => axios.get(`${API_URL}/hoteles/${this.props.route.match.params.hotel}/1`)
    let getLocaciones = () => axios.get(`${API_URL}/locaciones`)
    let getShows = () => axios.get(`${API_URL}/actividades`)

    axios.all([getActividades(), getLocaciones(), getShows()])
      .then(axios.spread((actividades, locaciones, shows) => {
        this.setState({ actividades: actividades.data, locaciones: locaciones.data, shows: shows.data })
      }))
      .catch(function (e) {
        if (e.response.status === 404) {
          res.status(404).send('!Página no encontrada!')
        }
      })
  }
  component() {
    return (
      <article className='main__body'>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='return-button'>
              <a href='home.html' className='btn btn-return'><span className='fa fa-angle-left fa-fw'></span></a>
              <h4>Hoteles</h4>
            </div>
          </div>
          <div className='col-xs-12'>

            <div id='tab-container' className='tab-container'>
              <Tabs>
                <TabList className='etabs'>
                  <Tab className='tab'>Listado</Tab>
                  <Tab className='tab'>Categorias</Tab>
                  <Tab className='tab'>Locaciones</Tab>
                </TabList>
                <TabPanel>
                  
                    <h5 className='title'>Entretenimiento</h5>
                    <div className='add-promotion pull-right'>
                      <a href='agregar-show.html' className='btn btn-success'><span className='fa fa-plus fa-fw'></span></a>
                    </div>
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
                              <td>LU-MA-MI-JU-VI</td>
                              <td><a href='#edit-promo' rel='modal:open' className='btn btn-edit'><i className='fa fa-pencil fa-fw'></i></a><a href='' className='btn btn-trash'><i className='fa fa-trash fa-fw'></i></a></td>
                            </tr>
                          ))
                        }

                      </tbody>
                    </table>
                  
                </TabPanel>
                <TabPanel>
                  <div id='categorias'>
                    <h5 className='title'>Entretenimiento</h5>
                    <div className='add-promotion pull-right'>
                      <a href='#add-category' rel='modal:open' className='btn btn-success open-popup-link'><span className='fa fa-plus fa-fw'></span></a>
                    </div>
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
                              <td><a href='#edit-promo' rel='modal:open' className='btn btn-edit'><i className='fa fa-pencil fa-fw'></i></a><a href='' className='btn btn-trash'><i className='fa fa-trash fa-fw'></i></a></td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div id='locaciones'>
                    <h5 className='title'>Entretenimiento</h5>
                    <div className='add-promotion pull-right'>
                      <a href='#add-location' rel='modal:open' className='btn btn-success open-popup-link'><span className='fa fa-plus fa-fw'></span></a>
                    </div>
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
                            <tr key={`locacion${l.evento_id}`}>
                              <td>{l.locacion}</td>
                              <td><a href='#edit-promo' rel='modal:open' className='btn btn-edit'><i className='fa fa-pencil fa-fw'></i></a><a href='' className='btn btn-trash'><i className='fa fa-trash fa-fw' /></a></td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
              </Tabs>
              {/* <ul className='etabs'>
                <li className='tab'></li>
                <li className='tab'></li>
                <li className='tab'><</li>
              </ul> */}
            </div>
          </div>
        </div>
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
