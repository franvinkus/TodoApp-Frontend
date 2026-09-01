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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40">
            {loggingIn? (
                //Login
                <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-auto w-[90%] max-w-[550px] fixed bg-white border-1 border-gray-500 rounded-xl p-4 z-100">
                    <div className="flex-col">
                        <div className="flex flex-col justify-start gap-y-2">
                            <div className="text-lg opacity-50">
                                Welcome Back
                            </div>
                            <div className="text-2xl opacity-100">
                                Login to Clear
                            </div>
                            <div className="text-md opacity-50">
                                Keep planning and move forward
                            </div>
                        </div>

                        <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }} 
                        className="flex-row justify space-y-7 mt-10">
                            <div className="flex flex-col">
                                <label className="mb-2 text-gray-400 font-semibold text-sm">Username </label>
                                <input
                                className="border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Insert username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 text-gray-400 font-semibold text-sm">Password </label>
                                <input
                                className="border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Insert Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </form>

                        <div className="flex flex-col justify-center items-center mt-6 gap-y-10">
                            <button 
                            className=" w-full border-2 text-white bg-green-700 rounded-lg px-3 py-1 hover:bg-green-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            >
                                Login
                            </button>

                            <div className="text-sm opacity-80">
                                Don&apos;t have an account?
                                <button 
                                className="text-sm text-green-900 hover:cursor-pointer hover:underline ml-2"
                                onClick={() => setIsLoggingIn(false)}
                                >
                                     Register, Here!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                //Register
                <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-auto w-[90%] max-w-[550px] fixed bg-white border-1 border-gray-500 rounded-xl p-4 z-100">
                    <div className="flex-col">

                        <div className="flex flex-col justify-start gap-y-2">
                            <div className="text-lg opacity-50">
                                Ready to Start Planning?
                            </div>
                            <div className="text-2xl opacity-100">
                                Register Account
                            </div>
                            <div className="text-md opacity-50">
                                Keep planning and move forward
                            </div>
                        </div>

                        <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="flex-row justify space-y-7 mt-8">
                            <div className="flex flex-col">
                                <label className="mb-2 text-gray-400 font-semibold text-sm">Username </label>
                                <input
                                className="border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Insert username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 text-gray-400 font-semibold text-sm">Email </label>
                                <input
                                className="border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Insert Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 text-gray-400 font-semibold text-sm">Password </label>
                                <input
                                className="border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Insert Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </form>
                
                        <div className="flex flex-col justify-center items-center mt-6 gap-y-10">
                            <button 
                            className=" w-full border-2 text-white bg-green-700 rounded-lg px-3 py-1 hover:bg-green-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            >
                                Register
                            </button>

                            <div className="text-sm opacity-80">
                                Already have an account?
                                <button 
                                className="text-sm text-green-900 hover:cursor-pointer hover:underline ml-2"
                                onClick={() => setIsLoggingIn(true)}
                                >
                                     Login, Here!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}