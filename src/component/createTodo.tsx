import React, { useEffect, useState } from "react";
import { postTodo, putTodo, TodoDetail } from "../app/api";
import { Circle, CircleCheckBig } from "lucide-react";

interface createTodoProps{
    onClose: () => void;
    onSuccess: () => void;
    initialData: TodoDetail | null;
}

const CreateTodo = ({onClose, onSuccess, initialData}: createTodoProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        todoPriority: "Low",
        subTodos: [] as { title: string; isDone: boolean }[]
    });

    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

        const parts = dateString.split(" ");
        const onlyDate = parts[0]; 
        const [day, month, year] = onlyDate.split("-");
        
        let hours = 0, minutes = 0, seconds = 0;
        if (parts.length > 1) {
            const timeParts = parts[1].split(":");
            hours = Number(timeParts[0]) || 0;
            minutes = Number(timeParts[1]) || 0;
            seconds = Number(timeParts[2]) || 0;
        }

        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), hours, minutes, seconds));
    }

    const formatLocalDate = (dateInput: Date | string | null) => {
        if (!dateInput) return '';
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return "";
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        if(initialData){
            setFormData({
                title: initialData.title,
                description: initialData.description,
                startDate: formatLocalDate(parseApiDate(initialData.startDate)),
                endDate: formatLocalDate(parseApiDate(initialData.endDate)),
                todoPriority: initialData.todoPriority,
                subTodos: initialData.subTodos ? initialData.subTodos.map(sub => ({
                    subId: sub.id,
                    title: sub.title,
                    isDone: sub.isDone
                })) : []
            });
        }
    }, [initialData]);

    const handleAddSubTodo = () => {
        setFormData(prevState => ({
            ...prevState,
            subTodos: [...prevState.subTodos, { subId: "", title: "", isDone: false }]
        }));
    };

    const handleSubTodoChange = (index: number, value: string) => {
        const updatedSubTodos = [...formData.subTodos];
        updatedSubTodos[index].title = value;

        setFormData(prevState => ({
            ...prevState,
            subTodos: updatedSubTodos
        }));
    };

    const handleRemoveSubTodo = (index: number) => {
        setFormData(prevState => ({
            ...prevState,
            subTodos: prevState.subTodos.filter((_, i) => i !== index)
        }));
    };

    const handleSubIsDone = (index: number, isDone: boolean) => {
        const updatedSubTodos = [...formData.subTodos];
        updatedSubTodos[index].isDone = !isDone;

        setFormData(prevState => ({
            ...prevState,
            subTodos: updatedSubTodos
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const payload = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : "",
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : ""
            };

            if(initialData){
                await putTodo(initialData.id, payload);
                console.log(payload);
            }else{
                await postTodo(payload);
            }
            onClose();
            onSuccess();
        }catch (error){
            console.error("Failed to do the operation:", error);
        }
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-brightness-65 z-40 ">
            <div className="bg-brand-cream p-6 rounded-lg shadow-xl max-w-[90%] max-h-[90%] w-auto border-1 border-gray-300 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between mb-6">
                    {initialData != null? (
                        <h2 className="text-xl">Refine your focus</h2>
                    ) : (
                        <h2 className="text-xl">Add Your Next Focus</h2>
                    )}

                    <button 
                    type="button" 
                    className="flex text-gray-400 hover:cursor-pointer" 
                    onClick={onClose}>
                        X
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-400 font-semibold text-sm">Title</label>
                        <input
                        type="text"
                        placeholder="title"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-white border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500 w-full px-2 py-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-400 font-semibold text-sm">Description</label>
                        <textarea
                        placeholder="Description"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="bg-white border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500 w-full px-2 py-3"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-x-4">
                        <div className="mb-4">
                            <label className="text-gray-400 font-semibold text-sm">Start:</label>
                            <input
                            type="datetime-local"
                            placeholder="startDate"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate ?? ''}
                            onChange={handleChange}
                            className="bg-white border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500 w-full px-2 py-3"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-gray-400 font-semibold text-sm">End:</label>
                            <input
                            type="datetime-local"
                            placeholder="endDate"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate ?? ''}
                            onChange={handleChange}
                            className="bg-white border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500 w-full px-2 py-3"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-400 font-semibold text-sm">Priority</label>
                        <div className="border border-gray-500 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-gray-500 bg-white">
                            <select
                            id="todoPriority"
                            name="todoPriority"
                            value={formData.todoPriority}
                            onChange={handleChange}
                            className=" rounded-xl p-3 outline-none overflow-hidden focus:ring-2 focus:ring-gray-500 w-full px-2 py-3 hover:cursor-pointer"
                            >
                                {/* <option value="" disabled className="text-gray-300" >Choose the Priority</option> */}
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-400 font-semibold text-sm">Sub-tasks</label>
                            
                            <button 
                                type="button" 
                                onClick={handleAddSubTodo}
                                className="text-xs text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-300"
                            >
                                + Add Sub-task
                            </button>
                        </div>

                        <div className="flex flex-col gap-y-2">
                            {formData.subTodos.map((sub, index) => (
                                <div key={index} className="flex items-center gap-x-2">
                                    <button 
                                    type="button"
                                    className={`h-auto text-green-300 ${!sub.isDone ? "p-2 rounded hover:cursor-pointer" : "p-2 rounded hover:cursor-pointer"}`}
                                    onClick={() => handleSubIsDone(index, sub.isDone)}>
                                        {!sub.isDone ? <Circle/> : <CircleCheckBig/>}
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Sub-task"
                                        value={sub.title}
                                        onChange={(e) => handleSubTodoChange(index, e.target.value)}
                                        className="bg-white border-1 border-gray-500 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-500 w-full px-2 py-3"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSubTodo(index)}
                                        className="text-xs text-white bg-red-600 px-3 py-1 rounded hover:bg-red-400"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-10">
                        <button 
                        type="button" 
                        className="p-2 px-5 text-gray-700 bg-gray-200 rounded hover:cursor-pointer mr-10" 
                        onClick={onClose}>
                            Close
                        </button>

                        {initialData != null? (
                            <button 
                            type="submit" 
                            className="p-2 px-5 text-white bg-green-700 rounded-xl hover:cursor-pointer hover:bg-green-900" >
                                Save Changes
                            </button>
                        ) : (
                            <button 
                            type="submit" 
                            className="p-2 px-5 text-white bg-green-700 rounded-xl hover:cursor-pointer hover:bg-green-900" >
                                Create Task
                            </button>
                        )}
                        

                    </div>

                </form>

            </div>
        </div>

    );
}

export default CreateTodo;