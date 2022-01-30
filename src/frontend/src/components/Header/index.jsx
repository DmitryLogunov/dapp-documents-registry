import React, { Component } from 'react';
import Cookies from "js-cookie";
import {Redirect} from "react-router-dom";

import {Menu} from "../Menu";

const accessTokenCookieName = '__dapp-docs-registry-access-token__';
const accountAddressCookieName = '__dapp-docs-registry-public-address__';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: Cookies.get(accessTokenCookieName),
      accountAddress: Cookies.get(accountAddressCookieName)
    };
  }

  render() {
    if (!this.state.accessToken ||
        typeof this.state.accessToken === 'undefined' ||
        this.state.accessToken === 'null') {
      return <Redirect to='/login'/>;
    }

    return (
      <div>
        <div className="header">
          <h1>NFT Oracles Registry
            <span className="accountAddress">Account address: {this.state.accountAddress}</span>
             <img src="/img/logout.png" className="logout" onClick={this.logout.bind(this)}/>
          </h1>
        </div>
        <hr/>
        <Menu />
      </div>
    );
  }

  logout() {
    Cookies.set(accessTokenCookieName, null);
    Cookies.set(accountAddressCookieName, '');
    window.location.href = '/login';
  }
}

