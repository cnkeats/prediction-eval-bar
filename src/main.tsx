import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/error-boundary'
import EvalBar from './components/eval-bar'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error(
    'Failed to find the root element to mount the React application. Please ensure there is an element with id "root" in your HTML.',
  )
}
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <EvalBar />
    </ErrorBoundary>
  </StrictMode>,
)
