import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from "react-router-dom";
import './index.css';
import * as serviceWorker from './serviceWorker';

import Main from './pages/main';
import Toast from './pages/toast';

const router = (
  <HashRouter>
    <Route path="/main" exact component={Main} />
    <Route path="/main/:timeout" exact component={Main} />
    <Route path="/toast" component={Toast} />
  </HashRouter>
)

ReactDOM.render(
  <React.StrictMode>
    {router}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
