import React, { Component } from 'react';
import {Header} from "../../components/Header";

class ProfilePage extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div className='content'>
          <h1> Profile</h1>
        </div>
      </div>
    );
  }
}

export const Profile = () => (
  <ProfilePage />
);
