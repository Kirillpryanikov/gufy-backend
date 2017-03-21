import React, { Component } from 'react'
import importcss from 'importcss'
import User from '../User'

@importcss(require('./Map.css'))
export default class Map extends Component {
  render() {
    return <div styleName='root'>
      <For each="user" of={ this.props.users }>
        <div styleName='userWrapper' style={{left: user.x + 'px', top: user.y + 'px'}}>
          <User { ...user } />
        </div>
      </For>
    </div>
  }
}
