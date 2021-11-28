import React, { Component } from 'react';
import {Header} from "../../components/Header";

class HomePage extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div className='content'>
          <h1>About</h1>
        </div>
      </div>
    );
  }
}

export const Home = () => (
  <HomePage />
);

