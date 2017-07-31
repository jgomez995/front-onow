import React from 'react'
import Layout from './layout'
import axios from 'axios'
import { connect } from 'react-redux'

const API_URL = 'http://localhost:8080/admin'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hoteles: [] }
  }
  componentWillMount () {
    axios.get(`${API_URL}/hoteles`, { headers: { 'X-Auth': this.props.session.user.token } })
      .then((res) => {
        this.setState({ hoteles: res.data })
      })
      .catch(e => console.log(e))
  }
  component () {
    return (
      <article className='main__body'>
        <div className='row'>
          <div className='col-xs-12'>
            <h5 className='title'>Hoteles</h5>
            <table className='table tables'>
              <thead>
                <tr>
                  <th>Hotel</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {this.state.hoteles.map((v) => (
                  <tr key={v.id}>
                    <td>
                      {v.nombre}
                    </td>
                    <td>
                      <a href='' rel='modal:open' className='btn btn-success open-popup-link'><span className='fa fa-bell fa-fw' /></a>
                      <a href={`/entretenimiento/${v.clave}`} className='btn btn-edit'><i className='fa fa-pencil fa-fw' /></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>
    )
  }
  render () {
    return (
      <Layout component={this.component()} />
    )
  }
}
const mapStateToProps = (session) => (session)
export default connect(mapStateToProps, null)(Home)
