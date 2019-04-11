import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
    render() {
        return (
            <div>
               <p>hello world</p>
            </div>
        );
    }
  }
  const mapStateToProps = (state: any, ownProps: any) => ({
    errorMessage: state.errorMessage,
    inputValue: ownProps.location.pathname.substring(1)
  })
  export default withRouter(connect(mapStateToProps)(Login))
