import React, { Component } from "react";

class MenuComponent extends Component {
  render() {
    return (
      <div>
        <nav>
          <a href="/">About</a>
          <a href="/people">People</a>
          <a href="/applications" style={{width:"150px"}}>Applications</a>
          <a href="/profile" className="noRightBorder">Profile</a>
        </nav>
      </div>
    );
  }
}

export const Menu = () => (
  <MenuComponent />
);