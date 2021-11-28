import React, { Component } from 'react';
import {Header} from "../../components/Header";

class ApplicationsPage extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div className='content'>
          <h1>Applications</h1>
        </div>
      </div>
    );
  }
}

export const Applications = () => (
  <ApplicationsPage />
);
