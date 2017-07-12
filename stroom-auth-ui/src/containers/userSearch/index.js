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
  accessor: 'totalLoginFailures'
}, {
  Header: 'Last login',
  accessor: 'lastLogin'
}, {
  Header: 'Updated on',
  accessor: 'updatedOn'
}, {
  Header: 'Updated by',
  accessor: 'updatedBy'
}, {
  Header: 'Created on',
  accessor: 'createdOn'
}, {
  Header: 'Created by',
  accessor: 'createdBy'
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
                data={data}
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
  errorStatus: state.user.errorStatus,
  errorText: state.user.errorText,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  performUserSearch
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSearch)