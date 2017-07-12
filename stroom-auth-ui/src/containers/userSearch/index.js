import React, { Component } from 'react'
import { Row, Col, Card, Preloader } from 'react-materialize'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { performUserSearch } from '../../modules/userSearch'

const data = [{
    id: '1',
    name: 'SomeGuy',
    totalLoginFailures: 5,
    lastLogin: '2017-01-01', 
    updatedOn: '2017-01-02', 
    updatedBy: 'anAdmin', 
    createdOn: '2017-01-03', 
    createdBy: 'anotherAdmin'
  }]

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
      <Row>
        <Col s={1}/>
        <Col s={12}>
          <Card>
            {this.props.showSearchLoader ? (
               <Row>
                <Col s={6}/>
                <Col s={2}><Preloader size='big'/></Col>
                <Col s={5}/>
              </Row>
              ) : (
                <ReactTable
                data={this.props.results}
                columns={columns}/>
              )
            }

          </Card>
        </Col>
        <Col s={1}/>
      </Row>
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