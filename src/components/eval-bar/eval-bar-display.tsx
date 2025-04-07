type EvalBarDisplayProps = {
  evalValue: number
}

const EvalBarDisplay: React.FC<EvalBarDisplayProps> = ({ evalValue }) => {
  return (
    <div
      style={{
        border: '0px solid red',
        display: 'flex',
        backgroundColor: 'rgba(94, 130, 191, 0.5)',
        boxSizing: 'border-box',
        height: '100vh',
        width: 'fit-content',
        flexDirection: 'column',
        justifyContent: 'stretch',
      }}
    >
      <div
        style={{
          flexGrow: 100 - evalValue,
          backgroundColor: '#db00b3',
          color: '#db00b3',
          fontWeight: 'bold',
          transition: 'all 1s',
        }}
      >
        Doubters
      </div>
      <div
        style={{
          flexGrow: evalValue,
          backgroundColor: '#1e69ff',
          color: '#1e69ff',
          fontWeight: 'bold',
          alignContent: 'end',
          transition: 'all 1s',
        }}
      >
        Believers
      </div>
    </div>
  )
}

export default EvalBarDisplay
