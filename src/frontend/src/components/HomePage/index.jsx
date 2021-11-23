import React, { Component } from 'react';
import Cookies from "js-cookie";
import {Redirect} from "react-router-dom";

const authTokenCookieName = '__dapp-docs-registry-token__';
const accountAddressCookieName = '__dapp-docs-registry-public-address__';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authToken: Cookies.get(authTokenCookieName),
      accountAddress: Cookies.get(accountAddressCookieName)
    };
  }

  render() {
    if (typeof this.state.authToken === 'undefined' || this.state.authToken === 'null') {
      return <Redirect to='/login'/>;
    }

    return (
      <div>
        <div className="homePage">
          <h1>Dapp Documents Registry
            <span className="accountAddress">Account address: {this.state.accountAddress}</span>
             <img src="/img/logout.png" className="logout" onClick={this.logout.bind(this)}/>
          </h1>
        </div>
        <hr/>
      </div>
    );
  }

  logout() {
    Cookies.set(authTokenCookieName, null);
    Cookies.set(accountAddressCookieName, '');
    window.location.href = '/login';
  }
}

export default Index;
