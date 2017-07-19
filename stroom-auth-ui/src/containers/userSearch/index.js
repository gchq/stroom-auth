import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'
import { CircularProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { performUserSearch } from '../../modules/userSearch'
import './UserSearch.css'

const columns = [{
  Header: 'Actions',
  accessor: 'id'
}, {
  Header: 'Email',
  accessor: 'email'
}, {
  Header: 'State',
  accessor: 'state'
}, {
  Header: 'Last login',
  accessor: 'last_ogin'
}, {
  Header: 'Login failures',
  accessor: 'login_failures'
}, {
  Header: 'Updated by',
  accessor: 'updated_by_user'
}, {
  Header: 'Updated',
  accessor: 'updated_on'
}, {
  Header: 'Comments',
  accessor: 'comments'
}]

class UserSearch extends Component {
  componentDidMount() {
    this.props.performUserSearch(this.props.token)
  }

  render() {
    return (
          <Paper className='UserSearch-main'>
            <Typography type="headline" component="h2">
              This is a list of all stored users
            </Typography>
            <Typography type="body1">
              It excludes those who might have logged in using certificates or LDAP credentials.
            </Typography>
            <br/>
            {this.props.showSearchLoader ? (
              <CircularProgress/>
            ) : (
              <ReactTable
              data={this.props.results}
              columns={columns}
              showPagination={false}/>
            )}
          </Paper>    
    )
  }
}

const mapStateToProps = state => ({
  token: state.login.token,
  showSearchLoader: state.userSearch.showSearchLoader,
  results: state.userSearch.results,
  errorStatus: state.user.errorStatus,
  errorText: state.user.errorText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  performUserSearch
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSearch)