import React, { useEffect, useState } from "react";
import { postTodo, putTodo, Todo } from "../app/api";

interface createTodoProps{
    onClose: () => void;
    onSuccess: () => void;
    initialData: Todo | null;
}

const CreateTodo = ({onClose, onSuccess, initialData}: createTodoProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState, 
            [name]: value
        }));
    }

    useEffect(() => {
        if(initialData){
            setFormData({
                title: initialData.title,
                description: initialData.description
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            if(initialData){
                await putTodo(initialData.id,formData);
            }else{
                await postTodo(formData);
            }
            onClose();
            onSuccess();
        }catch (error){
            console.error("Failed to do the operation:", error);
        }
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full border-2">
                <div className="flex justify-center mb-6">
                    <h2 className="text-xl">Add Your Next Project / Goal</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>Title:</label>
                        <input
                        type="text"
                        placeholder="title"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="rounded border w-full px-2 py-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label>Description:</label>
                        <textarea
                        placeholder="Description"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="rounded border w-full px-2 py-3"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button 
                        type="button" 
                        className="p-2 text-white bg-red-700 rounded hover:cursor-pointer hover:text-black hover:bg-red-400 mr-10" 
                        onClick={onClose}>
                            Close
                        </button>

                        <button 
                        type="submit" 
                        className="p-2 text-white bg-green-700 rounded hover:cursor-pointer hover:text-black hover:bg-green-400" >
                            Submit
                        </button>

                    </div>

                </form>

            </div>
        </div>

    );
}

export default CreateTodo;