import React from 'react'
import Layout from './layout'
import axios from 'axios'
import { connect } from 'react-redux'
import { TimePicker, notification, Spin, Input, Upload, Icon } from 'antd'
import moment from 'moment'

const API_URL = 'http://localhost:8080/admin'
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const openNotificationWithIcon = (type, msg) => {
  notification[type]({
    message: type.toUpperCase(),
    description: msg
  })
}
class editarShow extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {
      loading: false,
      hotel: this.props.route.match.params.hotel,
      imgBack: '/images/no-image.png',
      locacion: '',
      id: '',
      desc_en: '',
      desc_es: '',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      calendar: {
        Domingo: { dia: 'Domingo', disabled: true, num: 0, inicio: '12:00', final: '13:00' },
        Lunes: { dia: 'Lunes', disabled: true, num: 1, inicio: '12:00', final: '13:00' },
        Martes: { dia: 'Martes', disabled: true, num: 2, inicio: '12:00', final: '13:00' },
        Miércoles: { dia: 'Miércoles', disabled: true, num: 3, inicio: '12:00', final: '13:00' },
        Jueves: { dia: 'Jueves', disabled: true, num: 4, inicio: '12:00', final: '13:00' },
        Viernes: { dia: 'Viernes', disabled: true, num: 5, inicio: '12:00', final: '13:00' },
        Sábado: { dia: 'Sábado', disabled: true, num: 6, inicio: '12:00', final: '13:00' }
      }
    }
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.handleFileRemove = this.handleFileRemove.bind(this)
    this.diaActive = this.diaActive.bind(this)
    this.setInitialTime = this.setInitialTime.bind(this)
    this.setFinalTime = this.setFinalTime.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
  }
  componentWillMount() {
    const _this = this
    axios.get(`${API_URL}/actividad/${this.props.route.match.params.actividadId}`).then(r => {
      console.log(r)
      this.setState({
        show: r.data.nombre,
        id: `${r.data.evento_id}`,
        locacion: r.data.lugar,
        locacion_id: r.data.locacion_id,
        imgBack: `http://localhost:8080/${r.data.img}`,
        desc_en: r.data.descripcion_en,
        desc_es: r.data.descripcion_es
      })
      let files = r.data.gallery.map(g => (
        {
          uid: g.id,
          name: g.nombre_imagen,
          status: 'done',
          path: g.path,
          url: `http://localhost:8080/${g.path}`
        }
      ))

      r.data.calendar.forEach(d => {
        this.setState((prevState, props) => {
          let { calendar } = prevState
          let dia = { dia: dias[d.dia], disabled: false, num: d.dia, inicio: d.hora_inicio, final: d.hora_final }
          let newCalendar = { ...calendar, [dias[d.dia]]: dia }
          calendar = newCalendar
          console.log(newCalendar)
          return { ...prevState, calendar }
        })
      })

      this.setState({ fileList: files })
    })

    let getHoteles = () => axios.get(`${API_URL}/hoteles`, { headers: { 'X-Auth': this.props.session.user.token } })
    axios.all([getHoteles()])
      .then(axios.spread((hoteles) => {
        let hotel = hoteles.data.filter(e => e.clave === this.props.route.match.params.hotel)
        this.setState({ hotelId: hotel[0].id })
        return hotel[0].id
      }))
      .then(hotel => {
        axios.get(`${API_URL}/locaciones/${hotel}`).then(locaciones => {
          console.log(locaciones)
          _this.setState({ locaciones: locaciones.data })
        })
      })
      .catch(function (e) {
        if (e.response.status === 404) {
          res.status(404).send('!Página no encontrada!')
        }
      })
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
  handleBackgroundChange(e) {
    e.preventDefault()
    let _this = this
    let reader = new FileReader()
    let file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        portada: file,
        imgBack: reader.result
      },  _this.handleCoverUpdate)
    }
    reader.readAsDataURL(file)
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
    let form = {}
    form.dias = []
    form.inicio = []
    form.fin = []
    const { calendar } = this.state

    Object.values(calendar).forEach((v, i) => {
      if (!v.disabled) {
        form.dias.push(v.num)
        form.inicio.push(v.inicio)
        form.fin.push(v.final)
      }
    })
    form.show = this.state.id
    form.desc_es = this.state.desc_es
    form.desc_en = this.state.desc_en

    axios.post(`${API_URL}/editar/show`, form, {
      headers: {
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
  handleCoverUpdate() {
    let form = new FormData()
    let _this = this
    console.log(this.state)
    form.append('carpeta', this.state.show)
    form.append('hotel', this.state.hotel)
    form.append('lugar', this.state.locacion)
    form.append('show', this.state.id)
    form.append('hotel_id', this.state.hotelId)
    form.append('portada', this.state.portada, this.state.portada.name)
    axios.post(`${API_URL}/img/portada/update`, form, {
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
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }
  handleFileUpload({ fileList }) {
    this.setState({ fileList })
    console.log(this.state)
  }
  handleFileRemove(file) {
    console.log(file)
    axios.post(`${API_URL}/img/del`, {imgId: file.uid, imgPath: file.path}, {headers: {
      'X-Auth': this.props.session.user.token
    }}).then(r => console.log(r))
  }
  component() {
    const { previewVisible, previewImage, fileList } = this.state
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
                          <Input value={this.state.show} disabled className='form-control' />
                        </div>
                      </div>
                      <div className='col-xs-4'>
                        <div className='form-group'>
                          <label className='required' htmlFor='#'>Locación:</label>
                          <Input value={this.state.locacion} disabled className='form-control' />
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
                          {/* <DropzoneComponent config={componentConfig} djsConfig={djsConfig} eventHandlers={eventHandlers} /> */}
                          <Upload
                            action={`${API_URL}/img/agregar`}
                            listType='picture-card'
                            fileList={fileList}
                            headers={{'X-Auth': this.props.session.user.token}}
                            data={{show: this.state.id, carpeta: this.state.show, hotel: this.state.hotel, lugar: this.state.locacion}}
                            /* onPreview={this.handleFileAdded} */
                            onChange={this.handleFileUpload}
                            onRemove={this.handleFileRemove}
                          >
                            <div>
                              <Icon type='plus' />
                              <div className='ant-upload-text'>Upload</div>
                            </div>
                          </Upload>
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
                        <input id={`option_${i}`} type='checkbox' checked={!d.disabled} value={d.disabled} onChange={() => this.diaActive(d, i)} />
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
export default connect(mapStateToProps, null)(editarShow)
