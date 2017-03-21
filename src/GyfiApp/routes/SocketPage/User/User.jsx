import React, { Component } from 'react'
import importcss from 'importcss'

@importcss(require('./User.css'))
export default class User extends Component {
  render() {
    return <div styleName='root'>
      <div styleName='name'>
        &#60;{this.props.name}&#62;
      </div>
      <div styleName='avatarWrapper'>
        <img src={this.props.avatar || 'http://icons.iconarchive.com/icons/iconka/easter-egg-bunny/128/green-demon-icon.png'}  styleName='avatar' style={{width:64, height:64}} />
      </div>
    </div>
  }
}
