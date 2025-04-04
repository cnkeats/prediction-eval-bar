import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/error-boundary'
import EvalBar from './components/eval-bar'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <EvalBar />
    </ErrorBoundary>
  </StrictMode>,
)
