import React, { useState, useEffect } from 'react';
import timg from '../../timg.jpg';
import './index.css';
import { timedb } from '../../nedb'
const { ipcRenderer, remote } = window.require('electron')

function App() {
  const doOk = () => {
    ipcRenderer.send('toast_settimeout', '')
    remote.getCurrentWindow().destroy()
  }
  const doDelay = () => {
    ipcRenderer.send('toast_settimeout', 10 * 60)
    remote.getCurrentWindow().destroy()
  }

  return (
    <div className="toast">
      <img src={timg} className="logo" alt="logo" />
      <div className="content">
        时间到了
      </div>
      <div className="button-box">
        <div className="button" onClick={doOk}>好的</div>
        <div className="button" onClick={doDelay}>10分钟后再提醒</div>
      </div>
    </div>
  );
}

export default App;
