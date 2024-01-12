import React from 'react'
import ReactDOM from 'react-dom/client'

import markdown from '../content/hello.md'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>{JSON.stringify(markdown.meta)}</div>
  </React.StrictMode>,
)
