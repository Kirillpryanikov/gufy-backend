import React, { Component } from 'react'
import io from 'socket.io-client'
import Map from './Map'
// class User extends Component {
//   render() {
//     return <div>
//       map
//     </div>
//   }
// }


export default class SocketPage extends Component {
  constructor() {
    super()
    // const url = config.io.url
    const url = 'localhost:5000'
    this.socket = io.connect(url)
    const v = 10;
    const m = {
      37: {
        y: 0,
        x: -v,
      },
      38: {
        y: -v,
        x: 0,
      },
      39: {
        y: 0,
        x: v,
      },
      40: {
        y: v,
        x: 0,
      },
    }
    if (typeof document !== 'undefined') {
      document.body.onkeydown = (event) => {
          event = event || window.event;
          const d = m[event.keyCode]
          this.socket.emit('move', d)
      };
    }

    this.state = {
      users: [],
    }

    this.socket.on('changeUsers', (users) => {
      console.log('users', users);
      this.setState({
        users,
      })
    })



    // setInterval(() => {
    //   this.socket.emit('eventFromClient')
    // }, 1000)

    // this.post1socket = io.connect(config.io.url + "/api/v1/post/1")
    // this.post2socket = io.connect(config.io.url + "/api/v1/post/2")
    // this.post22socket = io.connect(config.io.url + "/api/v1/post/2")
    // setInterval(() => {
    //   this.post22socket.emit('post22socket')
    // }, 1000)
    //
    //
    //
    // setTimeout( () => {
    //   this.socket2 = io.connect(config.io.url + "/ns2")
    //   setInterval(() => {
    //     this.socket2.emit('eventFromClient2')
    //   }, 1000)
    // }, 2000)
    // setTimeout( () => {
    //   this.socket3 = io.connect(config.io.url + "/ns3")
    //   setInterval(() => {
    //     this.socket3.emit('eventFromClient3')
    //   }, 1000)
    // }, 3000)
    // setTimeout( () => {
    //   this.socket4 = io.connect(config.io.url + "/ns4")
    //   setInterval(() => {
    //     this.socket4.emit('eventFromClient4')
    //   }, 1000)
    // }, 4000)
    // setTimeout( () => {
    //   this.socket2.disconnect()
    //   this.socket3.disconnect()
    //   this.socket4.disconnect()
    // }, 10000)
  }

  render() {
    return <Map users={this.state.users}/>
    // return <h1 style={{ textAlign: 'center' }}>
    //   <Map />
    //
    // </h1>
  }
}

// -import React, { Component, PropTypes } from 'react';
// +import React, { Component } from 'react'
// +import { observer } from 'mobx-react'
// +import AppState from '../../stores/AppState'
//
// -import Row from 'react-bootstrap/lib/Row';
// -import Col from 'react-bootstrap/lib/Col';
// -
// -import Header from '../../components/Header';
// -import Ads from '../../components/Ads';
// -import {autobind} from 'core-decorators';
// +import { Row, Col, Well, Button } from 'react-bootstrap'
//
// +@observer
//  export default class IndexPage extends Component { //eslint-disable-line
// -  static propTypes = {
// -    context: PropTypes.object.isRequired,
// -  }
// -  constructor() {
// -    super()
// -    // const socket1 = io.connect('localhost:5000')
// -    this.state = {
// -      count: 10,
// -    }
// -    if(typeof io !== 'undefined'){
// -      this.socket = io.connect('localhost:5000')
// -      // this.socket = io.connect('/api/v1/counter')
// -      this.socket.on('update', (data) => {
// -        console.log('update!', data);
// -        this.setState(data)
// -      })
// -
// -      setInterval(() => {
// -        this.socket.emit('event22', {asdasdda:564745})
// -      }, 1000)
// -    }
// -  }
// -  @autobind
// -  inc() {
// -    const state = Object.assign({}, this.state, {
// -      count: this.state.count + 1
// -    })
// -    this.setState(state)
// -    this.socket.emit('update', state)
// -  }
// -  @autobind
// -  dec() {
// -    const state = Object.assign({}, this.state, {
// -      count: this.state.count - 1
// -    })
// -    this.setState(state)
// -    this.socket.emit('update', state)
// +  logout = () => {
// +    AppState.user.logout()
//    }
//    render() {
// +    const user = AppState.user
//      return (
//        <Row>
// -        <Header />
// -        <Col md={3}>
// -          {/* <TopHoneyWars likes={10} unlikes={10} />
// -          <TopHoneyUsers /> */}
// -        </Col>
// -        <Col md={6}>
// -          <h1>
// -            {this.state.count}
// -          </h1>
// -          <button onClick={this.dec}>
// -            --
// -          </button>
// -          <button onClick={this.inc}>
// -            ++
// -          </button>
// -          {/* <HoneyWar
// -            title='Ханивар #1'
// -            startDate={1470661200000}
// -            endDate={Date.now()}
// -            avatar='http://dummyimage.com/60x60/fff/333'
// -            name='Юрий Мельников'
// -            target='100 отжиманий!'
// -            complete={true}
// -            photo='http://goo.gl/yHa5TX'
// -            more={185}
// -            checker='Официальные сми'
// -            tags={['обама', 'политика', 'президент', 'сша']}
// -            likes={10}
// -            unlikes={55}
// -            comments={44}
// -            category='Политика'
// -            access='Всем'
// -            mission='Пробежаться полуголым по полю в Узбекистане :)'
// -          /> */}
// -        </Col>
// -        <Col md={3}>
// -          <Ads />
// +        <Col md={6} mdOffset={3}>
// +          {user.isAuth ? (
// +            <div>
// +              <h3>Приветствую тебя{` ${user.username}`}</h3>
// +              <h5>ID</h5>
// +              <Well>{user._id}</Well>
// +              <h5>TOKEN</h5>
// +              <Well style={{ wordWrap: 'break-word' }}>{user.token}</Well>
// +              <Button onClick={this.logout}>Выход</Button>
// +            </div>
// +          ) : (
// +            <div>
// +              <h3>Вы пока не авторизованы</h3>
// +              <a href='/'>Вернуться назад</a>
// +            </div>
// +          )}
//          </Col>
//        </Row>
//      );
