import { login, register } from "@/app/api";
import { useState } from "react";

interface param{
    onClose: () => void,
}

export default function LoginModal({onClose}: param) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loggingIn, setIsLoggingIn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const clearInputs = () =>{
        setUsername('');
        setEmail('');
        setPassword('');
    }
    
    const handleSubmit = async () => {
        if (isLoading) return;

        setIsLoading(true);


        if(loggingIn){
            try{
                const payload = {
                    username: username,
                    password: password,
                }
                const data = await login(payload);
                if(data){
                    onClose();
                    clearInputs();
                    setIsLoading(false);
                }
            }catch(error){
                console.log('error bray: ', error);
            }finally {
                setIsLoading(false);
            }
        }
        else{
            try{
                const payload = {
                    username: username,
                    email: email,
                    password: password,
                }
                const data = await register(payload);
                if(data){
                    setIsLoggingIn(true);
                    clearInputs();
                    setIsLoading(false);
                }
            }catch(error){
                console.log('error bray: ', error);
            }finally {
                setIsLoading(false);
            }
        }

    }

    return(
        <div>
            {loggingIn? (
                //Login
                <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[390px] w-[400px] fixed border-2 bg-white rounded-xl p-4">
                    <div className="flex-cols">
                        <div className="flex justify-center text-2xl">
                            <div>
                                Login
                            </div>
                        </div>

                        <div className="flex-row justify space-y-7 mt-10">
                            <div className="flex flex-col">
                                <label className="mb-2">Username: </label>
                                <input
                                className="border-2 border-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Insert username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2">Password: </label>
                                <input
                                className="border-2 border-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Insert Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button 
                            className="text-sm text-blue-400 hover:cursor-pointer hover:text-blue-300"
                            onClick={() => setIsLoggingIn(false)}
                            >
                                Don&apos;t have an account? Register, Here!
                            </button>

                            <button 
                            className="border-2 border-black rounded-xl p-3 hover:bg-black hover:border-white hover:text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>

            ) : (
                //Register
                <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[400px] fixed border-2 bg-white rounded-xl p-4">
                    <div className="flex-cols">
                        <div className="flex justify-center text-2xl">
                            <div>
                                Register
                            </div>
                        </div>

                        <div className="flex-row justify space-y-7 mt-8">
                            <div className="flex flex-col">
                                <label className="mb-2">Username: </label>
                                <input
                                className="border-2 border-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Insert username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2">Email: </label>
                                <input
                                className="border-2 border-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Insert Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2">Password: </label>
                                <input
                                className="border-2 border-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Insert Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                
                        <div className="flex justify-between items-center mt-6">
                            <button 
                            className="text-sm text-blue-400 hover:cursor-pointer hover:text-blue-300"
                            onClick={() => setIsLoggingIn(true)}
                            >
                                Login
                            </button>

                            <button 
                            className="border-2 border-black rounded-xl p-3 hover:bg-black hover:border-white hover:text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}