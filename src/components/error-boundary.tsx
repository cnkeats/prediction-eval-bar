import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={Fallback}>{children}</ReactErrorBoundary>
)
export default ErrorBoundary

const Fallback: React.FC<{ error: Error }> = ({ error }) => (
  <p style={{ color: 'red' }}>Error: {error.message || 'Something went wrong'}</p>
)
