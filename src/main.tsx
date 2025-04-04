import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './error-boundary'
import EvalBar from './eval-bar/eval-bar.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <EvalBar />
    </ErrorBoundary>
  </StrictMode>,
)
