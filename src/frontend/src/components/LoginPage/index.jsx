import Cookies from "js-cookie";
import React, { Component } from "react";
import {Redirect} from 'react-router-dom';
const Web3 = require('web3');

const authTokenCookieName = '__dapp-docs-registry-token__';
const accountAddressCookieName = '__dapp-docs-registry-public-address__';

let web3 = undefined;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authToken: Cookies.get(authTokenCookieName),
      accountAddress: Cookies.get(accountAddressCookieName),
      checkAuth: true
    };

    (async () => {
      await this.initAccountAddress()
    })();
  }

  /**
   * Main rendering
   */
  render() {
    if (typeof this.state.authToken !== 'undefined' && this.state.authToken !== 'null') {
       return <Redirect to='/'/>;
    }

    return (
      <div>
        <hgroup>
          <h1>Dapp Documents Registry</h1>
        </hgroup>
        <form>
          <div className="group">
            <div className="loginTitle">Login via Metamask</div>
            <div className="loginFormAccountAddress">Account address: {this.state.accountAddress}</div>
          </div>
          { !this.state.checkAuth ? <div className="authErrorNotice">Could not verify Ethereum address</div> : null }
          <button type="button" className="button buttonBlue"  onClick={this.handleSignIn.bind(this)}>Sign in
            <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
          </button>
        </form>
      </div>
    );
  }

  async initAccountAddress() {
    if (!window.ethereum) {
      window.alert('Please install MetaMask first.');
      return;
    }

    if (!web3) {
      try {
        await window.ethereum.enable();
        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert('You need to allow MetaMask.');
        return;
      }
    }

    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert('Please activate MetaMask first.');
      return;
    }

    const accountAddress = coinbase.toLowerCase();
    this.setState({accountAddress});
  }
  /**
   * The handler of click
   */
  async handleSignIn() {
    const accountAddress = this.state.accountAddress;

    const user = await this.getUser(accountAddress) || await this.createUser(accountAddress);
    if (!user) {
      alert('Could not get or create user');
      return;
    }

    const {nonce} = user;

    const signature = await this.handleSignMessage(accountAddress, nonce);
    const authToken = await this.handleAuthenticate(accountAddress, signature);

    if (authToken) {
      Cookies.set(authTokenCookieName, authToken);
      Cookies.set(accountAddressCookieName, accountAddress);
      window.location.href = '/';
    } else {
      Cookies.set(authTokenCookieName, null);
      Cookies.set(accountAddressCookieName, '');
      this.setState({checkAuth: false});
    }
  }

  /**
   * Returns user via API if it exists in DB
   *
   * @param accountAddress
   * @returns {Promise<{accountAddress, nonce: string}>}
   */
  async getUser(accountAddress) {
    return {accountAddress, nonce: '3r84ch34134784f8ffg13g'};
  }

  /**
   * Creates new user via API
   *
   * @param accountAddress
   * @returns {Promise<{accountAddress, nonce: string}>}
   */
  async createUser(accountAddress) {
    return {accountAddress, nonce: '3r84ch34134784f8ffg13g'};
  }

  /**
   * The handler of signing message up via the Metamask
   *
   * @param accountAddress
   * @param nonce
   * @returns {Promise<signature: string>}
   */
  async handleSignMessage(accountAddress, nonce) {
    const signature =
      await web3.eth.personal.sign(
        `Sign up random nonce: ${nonce}`,
        accountAddress,
        '');

    return signature;
  }

  async handleAuthenticate(accountAddress, signature) {
    return 'some-access-token';
  }
}

export default Login;