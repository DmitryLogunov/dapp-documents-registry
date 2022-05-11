import Cookies from "js-cookie";
import React, {Component} from "react";
import {Redirect} from 'react-router-dom';

const Web3 = require('web3');
import {v4 as uuidv4} from 'uuid';

const accessTokenCookieName = '__dapp-docs-registry-access-token__';
const accountAddressCookieName = '__dapp-docs-registry-public-address__';

const axios = require('axios').default;

let web3 = undefined;

class LoginPage extends Component {
  constructor(props) {
    super(props);

    const backendScheme = process.env.REACT_APP_BACKEND_URI_SCHEME;
    const backendRPCHost = process.env.REACT_APP_BACKEND_HOST_NAME_RPC;
    this.backendRPCUrl = `${backendScheme}://${backendRPCHost}/rpc`;
    this.blockchainSignupPhrasePrefix = process.env.REACT_APP_BLOCKCHAIN_SIGNUP_PHRASE_PREFIX;

    this.state = {
      accessToken: Cookies.get(accessTokenCookieName),
      accountAddress: Cookies.get(accountAddressCookieName),
      checkAuth: true,
      noticeInfo: null
    };

    (async () => {
      await this.initAccountAddress()
    })();
  }

  /**
   * Main rendering
   */
  render() {
    if (this.state.accessToken &&
      typeof this.state.accessToken !== 'undefined' &&
      this.state.accessToken !== 'null') {
      return <Redirect to='/'/>;
    }

    return (
      <div>
        <hgroup>
          <h1>NFT Oracles Registry</h1>
        </hgroup>
        <form>
          <div className="group">
            <div className="loginTitle">Login via Metamask</div>
            <div className="loginFormAccountAddress">Account address: {this.state.accountAddress}</div>
          </div>
          <div className="authErrorNotice" style={{display: !this.state.checkAuth ? '' : 'none'}}>Error: verifying
            Ethereum address failed!
          </div>
          <div className="noticeInfo"
               style={{display: this.state.noticeInfo ? '' : 'none'}}>{this.state.noticeInfo}</div>
          <button type="button" className="button buttonBlue" onClick={this.handleSignIn.bind(this)}>Sign in
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

    const user = await this.getOrCreateUser(accountAddress);
    if (!user) {
      alert('Could not get or create user');
      return;
    }

    const {nonce} = user;

    const signature = await this.handleSignMessage(accountAddress, nonce);
    if (!signature) return;

    const accessToken = await this.handleAuthenticate(accountAddress, signature);
    this.refreshAccessToken(accessToken);
  }

  /**
   * Returns user via API if it exists in DB or creates new user via API
   *
   * @param accountAddress
   * @returns {Promise<{accountAddress, nonce: string}>}
   */
  async getOrCreateUser(address) {
    const jsonRpcID = uuidv4();
    const body = {
      jsonrpc: "2.0",
      method: "users.getOrCreate",
      id: jsonRpcID,
      params: {accountAddress: address}
    };

    const response = await axios.post(this.backendRPCUrl, body);
    const {accountAddress, nonce} = (response.data && response.data.result) || {};

    if (!nonce) {
      this.setState({checkAuth: false});
    }

    return {accountAddress, nonce};
  }

  /**
   * The handler of signing message up via the Metamask
   *
   * @param accountAddress
   * @param nonce
   * @returns {Promise<signature: string>}
   */
  async handleSignMessage(accountAddress, nonce) {
    if (!nonce) return;

    this.setState({checkAuth: true});
    this.setState({noticeInfo: `To authenticate you should sign up in Metamask the random nonce: ${nonce}`});

    let signature;
    try {
      signature =
        await web3.eth.personal.sign(
          `${this.blockchainSignupPhrasePrefix} ${nonce} `,
          accountAddress,
          '');
    } catch (e) {
      this.setState({noticeInfo: null});
      this.setState({checkAuth: false});
      throw e;
    }

    return signature;
  }

  /**
   * The handler of authentication with blockchain accountAddress and signature
   *
   * @param address
   * @param signature
   * @returns {Promise<*>}
   */
  async handleAuthenticate(address, signature) {
    const jsonRpcID = uuidv4();
    const body = {
      jsonrpc: "2.0",
      method: "authentication.login",
      id: jsonRpcID,
      params: {accountAddress: address, signature}
    };

    const response = await axios.post(this.backendRPCUrl, body);
    const {accessToken} = (response.data && response.data.result) || {};

    return accessToken;
  }

  refreshAccessToken(accessToken) {
    const accountAddress = this.state.accountAddress;
    if (accessToken) {
      Cookies.set(accessTokenCookieName, accessToken);
      Cookies.set(accountAddressCookieName, accountAddress);
      window.location.href = '/';
      return;
    }

    Cookies.set(accessTokenCookieName, null);
    Cookies.set(accountAddressCookieName, '');
    this.setState({checkAuth: false});
  }
}

export const Login = () => (
  <LoginPage/>
);