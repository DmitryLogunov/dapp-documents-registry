import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Login, Home, Applications, People,Profile} from './pages';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/applications" component={Applications} />
          <Route path="/people" component={People} />
          <Route path="/profile" component={Profile} />
        </div>
      </Router>
    );
  }
}

export default App;
