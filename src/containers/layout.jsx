import React from 'react'
import Header from '../components/header'
import Menu from '../components/menu'
import Footer from '../components/footer'

class Layout extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <div className='wrap-container'>
          <Header />
          <main className='main'>
            <Menu />
            {this.props.component}
          </main>
        </div>
        <Footer />
      </div>
    )
  }
}
export default Layout
