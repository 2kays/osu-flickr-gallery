import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';

import App from './App';
import AppFav from './AppFav';

import './index.css';
import 'font-awesome/css/font-awesome.min.css';

// Set up the router to distinguish between PictureFrame and FavoriteManager

ReactDOM.render(
  <React.StrictMode>
      <Router history={history}>
        <Switch>
          <Route exact path='/favorites' component={AppFav}/>
          <Route path='/:photoId' component={App}/>
          <Route path='/' component={App}/>
        </Switch>
      </Router>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
