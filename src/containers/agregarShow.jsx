import React from 'react'
import Layout from './layout'
import axios from 'axios'
import { connect } from 'react-redux'
import DropzoneComponent from 'react-dropzone-component'
import ReactDOMServer from 'react-dom/server'
const API_URL = 'http://localhost:8080/admin'

var componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: 'no-url'
}
var djsConfig = {
  autoProcessQueue: false,
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className='gallery__item'>
      <div className='dz-details'>
        <div className='dz-filename'><span data-dz-name='true' /></div>
        <img className='gallery__item-img' data-dz-thumbnail='true' />
      </div>
      <div className='dz-progress'><span className='dz-upload' data-dz-uploadprogress='true' /></div>
      <div className='dz-success-mark'><span>✔</span></div>
      <div className='dz-error-mark'><span>✘</span></div>
      <div className='dz-error-message'><span data-dz-errormessage='true' /></div>
    </div>
  )
}
var djsConfigInput = {
  autoProcessQueue: false,
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className='upload_file'>
      <div className='dz-details'>
        <div className='dz-filename'><span data-dz-name='false' /></div>
        <img className='gallery__item-img' data-dz-thumbnail='true' />
      </div>
      <div className='dz-progress'><span className='dz-upload' data-dz-uploadprogress='true' /></div>
      <div className='dz-error-message'><span data-dz-errormessage='true' /></div>
    </div>
  )
}
var eventHandlers = { addedfile: (file) => console.log(file) }

class CrearShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hoteles: [] }
  }
  componentWillMount() {
    let getLocaciones = () => axios.get(`${API_URL}/locaciones`)
    let getShows = () => axios.get(`${API_URL}/actividades`)

    axios.all([getLocaciones(), getShows()])
      .then(axios.spread((locaciones, shows) => {
        this.setState({ locaciones: locaciones.data, shows: shows.data })
        console.log(this.state)
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
            <h5 className='title'>Nuevo Show</h5>
            <div className='row'>
              <div className='col-xs-2'>
                <div className='upload_file'>
                  <div className='upload_file__wrap'>
                    <img className='upload_file-image' src='images/no-image.png' alt='' />
                      <div className='upload_file__options'>
                        <label htmlFor='filenew' className='btn btn-success'>
                          <input id='filenew' type='file' className='gallery__file' />
                            <i className='fa fa-plus fa-fw' />
                        </label>
                      </div>
                      </div>
                      <div className='upload_file__label'><small>Imagen Portada</small></div>
                      <DropzoneComponent config={componentConfig} djsConfig={djsConfigInput} />
                  </div>
                </div>
                  <div className='col-xs-10'>
                    <div className='row'>
                      <div className='col-xs-4'>
                        <div className='form-group'>
                          <label className='required' htmlFor='#'>Nombre del Show:</label>
                          <select name='' id=''  className='form-control' required>
                            <option value='' disabled hidden>Seleccionar...</option>
                            <option value=''>Show 1</option>
                            <option value=''>Show 2</option>
                            <option value=''>Show 3</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-xs-4'>
                        <div className='form-group'>
                          <label className='required' htmlFor='#'>Locación:</label>
                          <select name='' id='' className='form-control' required>
                            <option value='' disabled selected hidden>Seleccionar...</option>
                            <option value=''>Locación 1</option>
                            <option value=''>Locación 2</option>
                            <option value=''>Locación 3</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xs-12'>
                  <h5 className='title'>Galería de Fotos</h5>
                  <div className='row'>
                    <div className='col-xs-12'>
                      <div className='gallery'>
                        <div className='gallery-wrap'>
                          <DropzoneComponent config={componentConfig} djsConfig={djsConfig} eventHandlers={eventHandlers} />
                          <div className='clearfix' />
                        </div>
                      </div>
                    </div>
                  </div>
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
const mapStateToProps = (session) => (session)
export default connect(mapStateToProps, null)(CrearShow)
