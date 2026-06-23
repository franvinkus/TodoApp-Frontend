"use client"
import React, {useState, useEffect} from "react";
import { deleteTodo, getTodos, patchTodo, Todo } from "./api";
import CreateTodo from "./component/createTodo"

const Homepage = () => {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<Todo|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popUp, setPopUp] = useState(false);
  const [search, setSearch] = useState("");
  const [isOldest, setIsOldest] = useState(true);

  const fetchGetTodo = async () => {
    try{
      const sortBy = isOldest? "Oldest" : "Latest";
      const data = await getTodos(search, sortBy);
      setTodos(data);
    }catch (error){
      setError("Error Fetching");
    }finally{
      setLoading(false);
    }
  }
  
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchGetTodo();
    }, 500);
    return () => clearTimeout(handler);
  }, [search, isOldest]);

  const handlePopUp = () => {
    setEditTodo(null);
    setPopUp(true)
  }

  const handleClosePopUp = () => {
    setPopUp(false);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
    setPopUp(true);
  }

  const handleFinished = async (id: number) => {
    try{
      await patchTodo(id);
      fetchGetTodo();
    }catch(error){
      console.log("Error patching", error);
    }
  }

  const handleDelete = async (id: number) => {
    try{
      await deleteTodo(id);
      fetchGetTodo();
    }catch(error){
      console.log("Error patching", error);
    }
  }

  const handleSort = () => {
    setIsOldest(setIsOldest => !setIsOldest);
  }

    return (
      <div className="flex flex-col items-center p-10">
        <h1 className="text-6xl mt-8 mb-8">To Do App</h1>
        <div className="flex justify-between w-11/12">
          <input
          type="text"
          placeholder="Search by Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-100 border border-black p-3 mb-5 rounded-sm"/>

          <button className="bg-gray-100 border border-black p-3 mb-5 rounded-sm hover:cursor-pointer"
          onClick={() => handleSort()}>
            {isOldest? "latest": "oldest"}
          </button>
        </div>

        {todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo.id}className="container border-2 rounded mb-8">
                <div className="p-4 flex">
                  <div className="w-full">
                    <div className="border-b-2 border-gray-500 mb-6">
                      <p className="pl-2 text-2xl">{todo.title}</p>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                      <div className="w-5/6 ">
                        <p className="pl-2 mb-4">{todo.description}</p>
                        <p className="pl-2 text-xs">Created: {todo.createdAt.toString()}</p>
                        <p className="pl-2 text-xs">Finished: {todo.finishedAt.toString()}</p>
                      </div>

                      <div>
                        <button className="p-2 text-white bg-orange-400 rounded mr-2 hover:cursor-pointer hover:text-black hover:bg-orange-200"
                        onClick={() => handleEditTodo(todo)}>
                          Edit
                        </button>
                        <button className="p-2 text-white bg-red-400 rounded mr-2 hover:cursor-pointer hover:text-black hover:bg-red-200"
                        onClick={() => handleDelete(todo.id)}>
                          Delete
                        </button>
                        <button className={todo.isCompleted ? "p-2 text-white bg-red-400 rounded hover:cursor-pointer hover:text-black hover:bg-red-200" : "p-2 text-white bg-green-400 rounded hover:cursor-pointer hover:text-black hover:bg-green-200"}
                        onClick={() => handleFinished(todo.id)}>
                          {todo.isCompleted ? "Undo" : "Finish"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center">No todos found.</div>
        )}

        <div className="flex justify-end">
          <button className="p-2 text-white bg-green-400 rounded hover:cursor-pointer hover:text-black hover:bg-green-200" onClick={handlePopUp}>
            Add Todo
          </button>
        </div>
        {popUp && <CreateTodo onClose={handleClosePopUp} onSuccess={fetchGetTodo} initialData={editTodo}/>}
      </div>  
    );
}

export default Homepage;