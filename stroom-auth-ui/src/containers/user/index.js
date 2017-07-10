import React from 'react'
import { Button, Card, Input, Row, Col } from 'react-materialize'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import {attemptCreate} from '../../modules/user'

import './User.css'

const data = [{
  name: 'Tanner Linsley',
  age: 26,
  friend: {
    name: 'Jason Maurer',
    age: 23,
  }
}]

const columns = [{
  Header: 'Name',
  accessor: 'name' // String-based value accessors!
}, {
  Header: 'Age',
  accessor: 'age',
  Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
}, {
  id: 'friendName', // Required because our accessor is not a string
  Header: 'Friend Name',
  accessor: d => d.friend.name // Custom value accessors!
}, {
  Header: props => <span>Friend Age</span>, // Custom header components!
  accessor: 'friend.age'
}]

class User extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    return (
        <Row>
        <Col s={4} />
          <Col s={4}>
              <div>
                <form>
                  <Card title='Please enter the details of the new user' actions={[
                    <Button key="submitButton" type="button" waves='light' className="Login-button" onClick={ () => this.props.attemptCreate(this.state.username, this.state.password)} onSubmit={ () => this.props.attemptCreate}>Create user</Button>
                  ]}>
                    <Row>
                      <Input label="Username" s={12} 
                        value={this.state.username} onChange={ (e) => this.setState({username: e.target.value})}/>
                    </Row>
                    <Row>
                      <Input type="password" label="Password" s={12} 
                        value={this.state.password} onChange={ (e) => this.setState({password: e.target.value})}/>
                    </Row>
                  </Card>
                </form>
              </div>
             </Col>
          <Col s={1} />
      </Row>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
  attemptCreate,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)