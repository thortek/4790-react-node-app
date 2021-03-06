import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './contexts/AuthContext'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

/* const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql/',
  cache: new InMemoryCache(),
}) */

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql/',
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
