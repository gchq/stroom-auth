import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { withStyles, createStyleSheet } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import { CircularProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { performUserSearch } from '../../modules/userSearch'
import './UserSearch.css'

const columns = [{
  Header: 'Id',
  accessor: 'id'
}, {
  Header: 'Name',
  accessor: 'name'
}, {
  Header: 'Total login failures',
  accessor: 'total_login_failures'
}, {
  Header: 'Last login',
  accessor: 'last_ogin'
}, {
  Header: 'Updated on',
  accessor: 'updated_on'
}, {
  Header: 'Updated by',
  accessor: 'updated_by_user'
}, {
  Header: 'Created on',
  accessor: 'created_on'
}, {
  Header: 'Created by',
  accessor: 'created_by_user'
}]

class UserSearch extends Component {
  componentDidMount() {
    this.props.performUserSearch(this.props.token)
  }

  render() {
    return (
          <Card>
            {this.props.showSearchLoader ? (
              <CircularProgress/>
            ) : (
              <ReactTable
              data={this.props.results}
              columns={columns}
              showPagination={false}/>
            )}
          </Card>    
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