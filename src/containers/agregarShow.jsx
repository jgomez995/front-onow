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
  addRemoveLinks: true,
  // previewTemplate: ReactDOMServer.renderToStaticMarkup(
  //   <div className='gallery__item' id='gallery__item'>
  //     <div className='dz-details'>
  //       <div className='dz-filename'><span data-dz-name='true' /></div>
  //       <img className='gallery__item-img' data-dz-thumbnail='true' />
  //     </div>
  //     <div className='dz-progress'><span className='dz-upload' data-dz-uploadprogress='true' /></div>
  //     <div className='dz-success-mark'><span>✔</span></div>
  //     <div className='dz-error-mark'><span>✘</span></div>
  //     <div className='dz-error-message'><span data-dz-errormessage='true' /></div>
  //     <button className='btn btn-trash' data-dz-remove><i className='fa fa-trash fa-fw' /></button>
  //   </div>
  // )
}

class CrearShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hotel: this.props.route.match.params.hotel,
      imgBack: '/images/no-image.png',
      shows: [],
      locaciones: [],
      locacion: '',
      show: '',
      desc_en: '',
      desc_es: '',
      files: []
    }
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
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

  handleBackgroundChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        portada: file,
        imgBack: reader.result
      });
    }
    reader.readAsDataURL(file)
  }
  handleFileUpload(e) {
    console.log(e)
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
    console.log(this.state)
  }
  formSubmit(e) {
    e.preventDefault()
    let form = new FormData()
    let files = this.state.files
    files.forEach((v, i) => {
      form.append(`show-${i}`, v, v.name)
    })
    form.append('locacion', this.state.locacion)
    form.append('show', this.state.show)
    form.append('desc_es', this.state.desc_es)
    form.append('desc_en', this.state.desc_en)
    form.append('portada', this.state.portada, this.state.portada.name)

    axios.post(`${API_URL}/newshow`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(function (e) {
        console.log(e)
      })
      .catch(function (e) {
        console.log(e)
      })
    console.log(this.state)
  }
  handleFileAdded(file) {
    let files = this.state.files
    files.push(file)
    this.setState({ files: files })
  }
  component() {
    let eventHandlers = { addedfile: this.handleFileAdded.bind(this) }
    return (
      <article className='main__body'>
        <form onSubmit={this.formSubmit}>
          <div className='row'>
            <div className='col-xs-12'>
              <h5 className='title'>Nuevo Show</h5>
              <div className='row'>
                <div className='col-xs-2'>
                  <div className='upload_file'>
                    <div className='upload_file__wrap'>
                      <img className='upload_file-image' src={this.state.imgBack} alt='' />
                      <div className='upload_file__options'>
                        <label htmlFor='filenew' className='btn btn-success'>
                          <input onChange={this.handleBackgroundChange} id='filenew' type='file' className='gallery__file' />
                          <i className='fa fa-plus fa-fw' />
                        </label>
                      </div>
                    </div>
                    <div className='upload_file__label'><small>Imagen Portada</small></div>
                  </div>
                </div>
                <div className='col-xs-10'>
                  <div className='row'>
                    <div className='col-xs-4'>
                      <div className='form-group'>
                        <label className='required' htmlFor='#'>Nombre del Show:</label>
                        <select onChange={this.handleInputChange} name='show' id='' value={this.state.show} className='form-control' required>
                          <option value='' disabled hidden>Seleccionar...</option>
                          {
                            this.state.shows.map(a => <option value={a.id} key={a.id}>{a.actividad}</option>)
                          }
                        </select>
                      </div>
                    </div>
                    <div className='col-xs-4'>
                      <div className='form-group'>
                        <label className='required' htmlFor='#'>Locación:</label>
                        <select onChange={this.handleInputChange} name='locacion' value={this.state.locacion} id='' className='form-control' required>
                          <option value='' disabled selected hidden>Seleccionar...</option>
                          {
                            this.state.locaciones.map(l => <option value={l.id} key={l.id}>{l.locacion}</option>)
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-12'>
                  <br />
                  <div className='form-group'>
                    <label htmlFor='desc_es'>Descripción Español:</label>
                    <textarea name='desc_es' onChange={this.handleInputChange} value={this.state.desc_es} id='desc_es' cols='30' rows='10' className='editor' />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-12'>
                  <br />
                  <div className='form-group'>
                    <label htmlFor='desc_en'>Descripción Inglés:</label>
                    <textarea name='desc_en' onChange={this.handleInputChange} value={this.state.desc_en} id='desc_en' cols='30' rows='10' className='editor' />
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
          <div className='col-xs-12'>
            <h5 className='title'>Dias Activos</h5>
            <div className='row activeDays'>
              <div className='col-xs-4 mb-20 mb-20'>
                <div className='checkbox'>
                  <input id='option_Lunes' type='checkbox' data-target='#dayLunes' />
                  <label htmlFor='option_Lunes'>Lunes</label>
                </div>
                <div className='row isDisabled' id='dayLunes'>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Inicial</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time start' disabled />
                    </div>
                  </div>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Final</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time end' disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-xs-offset-1 col-xs-4 mb-20 mb-20'>
                <div className='checkbox'>
                  <input id='option_Martes' type='checkbox' data-target='#dayMartes' />
                  <label htmlFor='option_Martes'>Martes</label>
                </div>
                <div className='row isDisabled' id='dayMartes'>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Inicial</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time start' disabled />
                    </div>
                  </div>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Final</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time end' disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-xs-4 mb-20 mb-20'>
                <div className='checkbox'>
                  <input id='option_Miércoles' type='checkbox' data-target='#dayMiércoles' />
                  <label htmlFor='option_Miércoles'>Miércoles</label>
                </div>
                <div className='row isDisabled' id='dayMiércoles'>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Inicial</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time start' disabled />
                    </div>
                  </div>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Final</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time end' disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-xs-offset-1 col-xs-4 mb-20 mb-20'>
                <div className='checkbox'>
                  <input id='option_Jueves' type='checkbox' data-target='#dayJueves' />
                  <label htmlFor='option_Jueves'>Jueves</label>
                </div>
                <div className='row isDisabled' id='dayJueves'>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Inicial</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time start' disabled />
                    </div>
                  </div>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Final</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time end' disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-xs-4 mb-20 mb-20'>
                <div className='checkbox'>
                  <input id='option_Viernes' type='checkbox' data-target='#dayViernes' />
                  <label htmlFor='option_Viernes'>Viernes</label>
                </div>
                <div className='row isDisabled' id='dayViernes'>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Inicial</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time start' disabled />
                    </div>
                  </div>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Final</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time end' disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-xs-offset-1 col-xs-4 mb-20 mb-20'>
                <div className='checkbox'>
                  <input id='option_Sábado' type='checkbox' data-target='#daySábado' />
                  <label htmlFor='option_Sábado'>Sábado</label>
                </div>
                <div className='row isDisabled' id='daySábado'>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Inicial</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time start' disabled />
                    </div>
                  </div>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Final</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time end' disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-xs-4 mb-20 mb-20'>
                <div className='checkbox'>
                  <input id='option_Domingo' type='checkbox' data-target='#dayDomingo' />
                  <label htmlFor='option_Domingo'>Domingo</label>
                </div>
                <div className='row isDisabled' id='dayDomingo'>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Inicial</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time start' disabled />
                    </div>
                  </div>
                  <div className='col-xs-6 form-group'>
                    <label className='required' htmlFor='#'>Horario Final</label>
                    <div className='input-group'>
                      <div className='input-group__add'>
                        <span className='fa fa-clock-o' />
                      </div>
                      <input type='text' className='form-control time end' disabled />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className='col-xs-12'>
            <div className='center-buttons'>
              <input type='submit' value='Guardar' className='btn btn-success btn-lg' onClick={() => console.log('enviar')} />
              <button className='btn btn-cancel btn-lg'>Cancelar</button>
            </div>
          </div>
        </form>
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
