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
import PropTypes, { object } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import queryString  from 'query-string'
import jwtDecode from 'jwt-decode'

import { changeToken } from '../../modules/login'
import { relativePush } from '../../relativePush'

class ResetPassword extends Component {

  constructor() {
    super();
    this.state = {
      noToken: false
    }
  }

  componentDidMount(){
    let missingToken = false;
    let invalidToken = false;
    let expiredToken = false;
    
    const token = queryString.parse(this.context.router.route.location.search).token;

    // Validate token
    if(!token){
      missingToken = true
    }
    else {  
      try{
        const decodedToken = jwtDecode(token);
        const now = new Date().getTime() / 1000;
        expiredToken = decodedToken.exp <= now
      } catch (err) {
        invalidToken = true
      }
    }

    if(missingToken || invalidToken || expiredToken) {
      this.setState({noToken:true})
    }
    else {
      this.context.store.dispatch(changeToken(token));
      this.context.store.dispatch(relativePush('/changepassword'))
    }  
  }

  render() {
    return ( 
      <div>
        { this.state.noToken ? (
          <div>
            <h4>Unable to change password!</h4>
            <p>It looks like you're trying to reset your password but the URL you're using is either broken or has expired.</p>
          </div>
        ) : (undefined) }
      </div>
      
    )
  }
  
}

ResetPassword.contextTypes = {
  store: PropTypes.object.isRequired,
  router: PropTypes.shape({
    history: object.isRequired,
  }),
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changeToken
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword)