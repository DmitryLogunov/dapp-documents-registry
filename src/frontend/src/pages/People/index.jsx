import React, { Component } from 'react';
import {Header} from "../../components/Header";

class PeoplePage extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div className='content'>
          <h1> People</h1>
        </div>
      </div>
    );
  }
}

export const People = () => (
  <PeoplePage />
);
