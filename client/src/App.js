import React from 'react'
import { Route } from 'react-router-dom'
import './App.css'
import SenatorList from './views/SenatorList'
import RepresentativeList from './views/RepresentativeList'
import Layout from './components/Layout'
import Welcome from './components/Welcome'
import { CongressContextProvider } from './contexts/CongressContext'
import { CSSTransition } from 'react-transition-group'
import RickMortyViewer from './components/RickMortyViewer'
import MovieList from './views/MovieList'
import CourseList from './views/CourseList'

const routes = [
  { path: '/house', Component: RepresentativeList },
  { path: '/senate', Component: SenatorList },
  { path: '/graphql', Component: RickMortyViewer },
  {path: '/courses', Component: CourseList},
  { path: '/movies', Component: MovieList },
  { path: '/', Component: Welcome }
]

function App() {
  return (
    <CongressContextProvider>
      <div className='App'>
        <Layout />
        {routes.map(({ path, Component }) => (
          <Route key={path} exact path={path}>
          {({ match }) => (
              <CSSTransition
                in={match !== null}
                timeout={300}
                classNames='fade'
                unmountOnExit
              >
                <div className='fade'>
                  <Component />
                </div>
                </CSSTransition>
            )}
          </Route>
        ))}
        
      </div>
    </CongressContextProvider>
  )
}

export default App
