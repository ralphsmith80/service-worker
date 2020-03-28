import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <React.StrictMode>
    <App text="Test" />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// Examples on prompting refresh: https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
serviceWorker.register({
  onSuccess: registration => {
    console.log('SUCCESS!!', registration)
    console.log('Content is cached for offline use.')
  },
  onUpdate: registration => {
    console.log('UPDATE!!', registration)
    console.log(
      'New content is available and will be used when all ' +
        'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
    )
    if (window.confirm('New version available! OK to refresh?')) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }
})
