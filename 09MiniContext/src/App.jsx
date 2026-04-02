
import UserContextProvider from './context/UserContextProvider.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'

function App() {

  return (
      <UserContextProvider>
        <div className="App">
          <h1>Mini Context API</h1>
          <Login />
          <Profile />
        </div>
      </UserContextProvider>
  )
}

export default App
