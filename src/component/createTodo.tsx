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
        description: "",
        startDate: null as Date | null,
        endDate: null as Date | null,
    });

    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState, 
            [name]: value
        }));
    }

    const parseApiDate = (dateString: string | Date | null | undefined) => {
        if (!dateString || dateString === "-") return null;

        if (dateString instanceof Date) {
          return dateString;
        }

        const onlyDate = dateString.split(" ")[0]; 
        const [day, month, year] = onlyDate.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    useEffect(() => {
        if(initialData){
            setFormData({
                title: initialData.title,
                description: initialData.description,
                startDate: parseApiDate(initialData.startDate),
                endDate: parseApiDate(initialData.endDate)
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

                    <div className="mb-4">
                        <label>Start:</label>
                        <input
                        type="date"
                        placeholder="startDate"
                        id="startDate"
                        name="startDate"
                        value={
                            formData.startDate 
                                ? (typeof formData.startDate === 'string' 
                                    ? (formData.startDate as string).split('T')[0] 
                                    : (formData.startDate as Date).toISOString().split('T')[0]) 
                                : ''
                        }
                        onChange={(e) => setFormData(prevState => ({
                            ...prevState,
                            startDate: e.target.value ? new Date(e.target.value) : null
                        }))}
                        className="rounded border w-full px-2 py-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label>End:</label>
                        <input
                        type="date"
                        placeholder="endDate"
                        id="endDate"
                        name="endDate"
                        value={
                            formData.endDate 
                                ? (typeof formData.endDate === 'string' 
                                    ? (formData.endDate as string).split('T')[0] 
                                    : (formData.endDate as Date).toISOString().split('T')[0]) 
                                : ''
                        }
                        onChange={(e) => setFormData(prevState => ({
                            ...prevState,
                            endDate: e.target.value ? new Date(e.target.value) : null
                        }))}
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