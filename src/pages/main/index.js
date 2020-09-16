import React, { useState, useEffect } from 'react';
import timg from '../../timg.jpg';
import './index.css';
import { timedb } from '../../nedb'
const { ipcRenderer } = window.require('electron')

const default_duration = 60 * 60

let timoutHandler = null;

function Main(props) {
  const [duration, setDuration] = useState(default_duration)
  const [nowTimeOut, setNowTimeOut] = useState(default_duration)
  useEffect(() => {
    timedb.find({ name: 'timer' }, (err, docs) => {
      let newDuration = default_duration;
      if (docs && docs.length && docs[0] && docs[0].duration) {
        newDuration = docs[0].duration
        setDuration(newDuration)
      } else {
        timedb.insert({ name: 'timer', duration: newDuration }, (err, docs) => {
          if (err) { console.log(err) }
        })
      }

      const timeout = props && props.match && props.match.params && props.match.params.timeout
      if (timeout !== undefined && timeout !== null) {
        setNowTimeOut(timeout)
      } else {
        setNowTimeOut(newDuration)
      }
    })
  }, [])

  useEffect(() => {
    // 注册监听
    ipcRenderer.on("settimeout", (event, arg) => {
      if (arg) {
        setNowTimeOut(arg)
      } else {
        reset()
      }
    })
    return () => {
      ipcRenderer.removeAllListeners("settimeout")
    }
  })

  useEffect(() => {
    if (nowTimeOut > 0) {
      timoutHandler && clearTimeout(timoutHandler)
      timoutHandler = setTimeout(() => {
        setNowTimeOut(nowTimeOut - 1)
      }, 1000)
    } else {
      if (duration > 0) {
        onNowTimeOut()
      }
    }
  }, [nowTimeOut])

  const onDurationChange = (e) => {
    const t = (parseInt(e.target.value) || 0) * 60
    setDuration(t)
    if (t > 0) {
      timedb.update({ name: 'timer' }, { name: 'timer', duration: t })
    }
  }

  const reset = () => {
    setNowTimeOut(duration)
  }
  const quit = () => {
    ipcRenderer.send('main_quit', '')
  }

  const onNowTimeOut = () => {
    ipcRenderer.send('main_timeout', '')
  }

  const formatNowTimeOut = (time) => {
    const hour = parseInt(time / 60 / 60) || 0
    const min = parseInt(time / 60 % 60) || 0
    const sen = parseInt(time % 60) || 0
    return `${hour ? (hour + '小时') : ''}${min}分钟${sen}秒`
  }
  return (
    <div className="main">
      <img src={timg} className="logo" alt="logo" />
      <div className="content">
        <p>定时： <input value={duration / 60} type="number" min="0" max="600" onChange={onDurationChange} /> 分钟</p>
        <p>还有 <span>{formatNowTimeOut(nowTimeOut)}</span> 提醒</p>
      </div>
      <div className="button-box">
        <div className="button" onClick={reset}>重置</div>
        <div className="button" onClick={quit}>退出</div>
      </div>

    </div>
  );
}

export default Main;
