import { useState } from 'react'

function TestApp() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>🎉 React está a funcionar!</h1>
      <p>Contador: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Incrementar
      </button>
      <hr />
      <p>Se vês isto, o React está a funcionar corretamente!</p>
    </div>
  )
}

export default TestApp
