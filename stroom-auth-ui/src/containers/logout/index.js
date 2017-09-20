/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react'
import { Redirect } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {logout} from '../../modules/login'
import { relativePath } from '../../relativePush'

class Logout extends Component {
  componentDidMount(){
    this.props.logout()
  }

  render() {
    return ( <Redirect to={relativePath("/")}/>)
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
  logout
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)