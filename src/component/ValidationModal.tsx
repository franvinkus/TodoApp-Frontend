import { deleteTodo } from "@/app/api";
import React from "react";

interface Props{
    message: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ValidationModal: React.FC<Props> = ({message, onClose, onConfirm}) => {
    return(
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-brightness-65 z-40">
            <div className="bg-brand-cream p-6 rounded-lg shadow-xl max-w-[90%] w-[400px] border-1 border-gray-300">
                <div className="flex flex-col justify-between gap-y-5">
                    <div className="flex flex-row justify-between align-middle">
                        <h2 className="text-xl"> {message}</h2>
                        <button 
                        type="button" 
                        className="flex text-2xl text-gray-400 hover:cursor-pointer" 
                        onClick={onClose}>
                            X
                        </button>
                    </div>

                    <div className="flex flex-row justify-between align-bottom">
                        <button 
                        type="button" 
                        className="p-2 px-5 text-gray-700 bg-gray-200 rounded-xl hover:cursor-pointer mr-10" 
                        onClick={onClose}>
                            Close
                        </button>

                        <button 
                        type="submit" 
                        className="p-2 px-5 text-white bg-red-700 rounded-xl hover:cursor-pointer hover:bg-red-900" 
                        onClick={onConfirm}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ValidationModal;