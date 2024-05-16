'use client'

import { sendLogin } from "@utils/user"
import { useState } from "react"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const input = "bg-gray-600 rounded-xl overflow-hidden px-8 col-span-6"
    const inputParent = "grid grid-cols-8 w-full h-full space-between"
    const inputText = "text-xl flex items-center justify-start col-span-2"
    const rows = error.length ? "grid-rows-5 h-[35vh]" : "grid-rows-4 h-[30vh]"

    async function handleClick() {
        const result = await sendLogin({username, password})

        if (!result) {
            setError("Invalid username or password")
        }
    }

    return (
        <div className="w-full h-full grid place-items-center">
            <div className={`bg-gray-800 w-[35vw] rounded-xl grid place-items-center ${rows} gap-4 p-5 px-10`}>
                <h1 className=" text-3xl font-semibold">Login</h1>
                {error.length ? <h1 className="text-red-500 text-xl">{error}</h1> : null}
                <div className={inputParent}>
                    <h1 className={inputText}>Username:</h1>
                    <input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        type="text" 
                        placeholder="Username" 
                        className={input}
                    />
                </div>
                <div className={inputParent}>
                    <h1 className={inputText}>Password:</h1>
                    <input 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password" 
                        placeholder="Password" 
                        className={input} 
                    />
                </div>
                <div 
                    className="grid w-full h-full bg-orange-500 rounded-xl" 
                    onClick={handleClick}
                >
                    <h1 className="text-2xl place-self-center">Login</h1>
                </div>
                <div className={inputParent} /> 
            </div>
        </div>  
    )
}