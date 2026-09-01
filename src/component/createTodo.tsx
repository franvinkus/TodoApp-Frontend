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
        startDate: "",
        endDate: "",
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
            });
        }
    }, [initialData]);

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
                        type="datetime-local"
                        placeholder="startDate"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate ?? ''}
                        onChange={handleChange}
                        className="rounded border w-full px-2 py-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label>End:</label>
                        <input
                        type="datetime-local"
                        placeholder="endDate"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate ?? ''}
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