import React from 'react'
import Layout from './layout'
import axios from 'axios'
import { connect } from 'react-redux'
import DropzoneComponent from 'react-dropzone-component'
import { TimePicker, notification, Spin } from 'antd'
import moment from 'moment'
const API_URL = 'http://localhost:8080/admin'

var componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: 'no-url'

}
var djsConfig = {
  autoProcessQueue: false,
  addRemoveLinks: true
}
const openNotificationWithIcon = (type, msg) => {
  notification[type]({
    message: type.toUpperCase(),
    description: msg
  })
}
class CrearShow extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {
      loading: false,
      hotel: this.props.route.match.params.hotel,
      imgBack: '/images/no-image.png',
      shows: [],
      locaciones: [],
      locacion: '',
      show: '',
      desc_en: '',
      desc_es: '',
      files: [],
      calendar: {
        Domingo: { dia: 'Domingo', disabled: true, num: 0, inicio: '12:00', final: '13:00' },
        Lunes: { dia: 'Lunes', disabled: true, num: 1, inicio: '12:00', final: '13:00' },
        Martes: { dia: 'Martes', disabled: true, num: 2, inicio: '12:00', final: '13:00' },
        Miercoles: { dia: 'Miercoles', disabled: true, num: 3, inicio: '12:00', final: '13:00' },
        Jueves: { dia: 'Jueves', disabled: true, num: 4, inicio: '12:00', final: '13:00' },
        Viernes: { dia: 'Viernes', disabled: true, num: 5, inicio: '12:00', final: '13:00' },
        Sábado: { dia: 'Sábado', disabled: true, num: 6, inicio: '12:00', final: '13:00' }
      }
    }
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.diaActive = this.diaActive.bind(this)
    this.setInitialTime = this.setInitialTime.bind(this)
    this.setFinalTime = this.setFinalTime.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
  }
  diaActive(d, i) {
    this.setState((prevState, props) => {
      let { calendar } = prevState
      let dia = { dia: d.dia, disabled: !d.disabled, num: d.num, inicio: d.inicio, final: d.final }
      let newCalendar = { ...calendar, [d.dia]: dia }
      calendar = newCalendar
      console.log(newCalendar)
      return { ...prevState, calendar }
    })
  }
  setInitialTime(d, t, m) {
    console.log(m)
    // let dia = { dia: d.dia, disabled: !d.disabled, num: d.num, inicio: d.disabled ? d.inicio : null, final: d.disabled ? d.final : null }
    this.setState((prevState, props) => {
      let { calendar } = prevState
      let dia = { dia: d.dia, disabled: d.disabled, num: d.num, inicio: t, final: d.final }
      let newCalendar = { ...calendar, [d.dia]: dia }
      calendar = newCalendar
      console.log(newCalendar)
      return { ...prevState, calendar }
    })
  }
  setFinalTime(d, t) {
    this.setState((prevState, props) => {
      let { calendar } = prevState
      let dia = { dia: d.dia, disabled: d.disabled, num: d.num, inicio: d.inicio, final: t }
      let newCalendar = { ...calendar, [d.dia]: dia }
      calendar = newCalendar
      console.log(newCalendar)
      return { ...prevState, calendar }
    })
  }
  componentWillMount() {
    let getLocaciones = () => axios.get(`${API_URL}/locaciones`)
    let getShows = () => axios.get(`${API_URL}/actividades`)
    let getHoteles = () => axios.get(`${API_URL}/hoteles`, { headers: { 'X-Auth': this.props.session.user.token } })
    axios.all([getLocaciones(), getShows(), getHoteles()])
      .then(axios.spread((locaciones, shows, hoteles) => {
        let hotel = hoteles.data.filter(e => e.clave === this.props.route.match.params.hotel)
        this.setState({ locaciones: locaciones.data, shows: shows.data, hotelId: hotel[0].id })
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
      })
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
    this.setState({ loading: true })
    let _this = this
    let form = new FormData()
    const { files, calendar } = this.state
    files.forEach((v, i) => {
      form.append(`show-${i}`, v, v.name)
    })
    Object.values(calendar).forEach((v, i) => {
      if (!v.disabled) {
        form.append('dias[]', v.num)
        form.append('inicio[]', v.inicio)
        form.append('fin[]', v.final)
      }
    })
    form.append('locacion', this.state.locacion)
    form.append('show', this.state.show)
    form.append('desc_es', this.state.desc_es)
    form.append('desc_en', this.state.desc_en)
    form.append('hotel_id', this.state.hotelId)
    if (this.state.portada) {
      form.append('portada', this.state.portada, this.state.portada.name)
    } else {
      openNotificationWithIcon('error', 'La imagen portada Es Obligatorio')
      _this.setState({ loading: false })
      return false
    }

    axios.post(`${API_URL}/newshow`, form, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'X-Auth': this.props.session.user.token
      }
    })
      .then(function (e) {
        console.log(e)
        if (e.data.error) {
          openNotificationWithIcon('error', e.data.error)
        } else {
          openNotificationWithIcon('success', e.data.success)
        }
        _this.setState({ loading: false })
      })
      .catch(function (e) {
        console.log(e)
        openNotificationWithIcon('error', e.message)
        _this.setState({ loading: false })
      })
  }
  handleFileAdded(file) {
    let files = this.state.files
    files.push(file)
    this.setState({ files: files })
  }
  component() {
    let eventHandlers = { addedfile: this.handleFileAdded.bind(this) }
    return (
      <Spin spinning={this.state.loading} size='large'>
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
                {
                  Object.values(this.state.calendar).map((d, i) => (
                    <div className='col-xs-offset-1 col-xs-4 mb-20 mb-20' key={`daysKey_${d.num}`}>
                      <div className='checkbox'>
                        <input id={`option_${i}`} type='checkbox' value={d.disabled} onChange={() => this.diaActive(d, i)} />
                        <label htmlFor={`option_${i}`}>{d.dia}</label>
                      </div>
                      <div className={(d.disabled) ? 'row isDisabled' : 'row'} id={`day${i}`}>
                        <div className='col-xs-6 form-group'>
                          <label className='required' htmlFor='#'>Horario Inicial</label>
                          <div className='input-group'>
                            <TimePicker defaultValue={moment(d.inicio, 'HH:mm')} format='HH:mm' size='large' disabled={d.disabled} onChange={(moment, time) => this.setInitialTime(d, time, moment)} />
                          </div>
                        </div>
                        <div className='col-xs-6 form-group'>
                          <label className='required' htmlFor='#'>Horario Final</label>
                          <div className='input-group'>
                            <TimePicker defaultValue={moment(d.final, 'HH:mm')} format='HH:mm' size='large' disabled={d.disabled} onChange={(moment, time) => this.setFinalTime(d, time)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='col-xs-12'>
              <div className='center-buttons'>
                <input type='submit' value='Guardar' className='btn btn-success btn-lg' onClick={() => console.log('enviar')} />
                <a className='btn btn-cancel btn-lg' onClick={() => this.props.route.history.goBack()}>Regresar</a>
              </div>
            </div>
          </form>
        </article>
      </Spin>
    )
  }
  render() {
    // if (this.state.loading) {
    //   return <Layout component={<p>cargando</p>} />
    // }
    return (
      <Layout component={this.component()} />
    )
  }
}
const mapStateToProps = (session) => (session)
export default connect(mapStateToProps, null)(CrearShow)
