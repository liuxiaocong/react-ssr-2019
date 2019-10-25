import React from 'react';
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import logo from './logo.svg';
import style from './App.css';
import Home from './containers/home/indexReduce';
import About from './containers/about';
import Me from './containers/me';

function App() {
  return (
    <div className={style.wrap}>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/me">Me</Link>
          </li>
        </ul>
      </nav>

      {/* A <Switch> looks through its children <Route>s and
       renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/me">
          <Me />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
