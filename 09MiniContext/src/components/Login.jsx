import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext' 

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { setUser } = useContext(UserContext);

    const handleLogin = (e) => {
        e.preventDefault();
        setUser({ username, password });
    }

    return (
        <div>
            <h2>Login Component</h2>
            <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" 
            /> {"    "}
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
            /> <br/><br/>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login