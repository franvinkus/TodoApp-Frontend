"use client"
import React, {useState, useEffect} from "react";
import { deleteTodo, getTodos, patchTodo, Todo } from "../api";
import CreateTodo from "../../component/createTodo"
import TodoCalendar from "../../component/Calendar";
import LoginModal from "@/component/LoginModal";
import { getToken, isLoggedIn } from "@/utils/Auth";

const Homepage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<Todo|null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [popUp, setPopUp] = useState(false);
  const [search, setSearch] = useState("");
  const [isOldest, setIsOldest] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    const logged = isLoggedIn();
    if (!logged) {
      setIsModal(true); 
    }
  }, []);

  const fetchGetTodo = async () => {
    const token = getToken();
    if(!token) return;

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
    setIsMounted(true);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleCloseModal = () =>{
    setIsModal(false);
    fetchGetTodo();
  }

  const parseApiDate = (dateString: any) => {
        if (!dateString || dateString === "-") return null;
        const onlyDate = dateString.split(" ")[0]; 
        const [day, month, year] = onlyDate.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    return (
      <div className="flex flex-col items-center p-10">
        {isMounted && isModal && (
          <LoginModal onClose={handleCloseModal}/>
        )}

        <h1 className="text-6xl mt-8 mb-8">To Do App</h1>
        <TodoCalendar todos={todos}/>
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
                        <div className="grid grid-cols-2 gap-y-1 w-3/4"> 
                            <p className="pl-2 text-xs">Created: {parseApiDate(todo.createdAt)?.toLocaleDateString("id-ID")}</p>
                            <p className="pl-2 text-xs">Finished: {parseApiDate(todo.finishedAt)?.toLocaleDateString("id-ID") ?  parseApiDate(todo.finishedAt)?.toLocaleDateString("id-ID") : "-"}</p>
                            
                            <p className="pl-2 text-xs">Start: {parseApiDate(todo.startDate)?.toLocaleDateString("id-ID")}</p>
                            <p className="pl-2 text-xs">End: {parseApiDate(todo.endDate)?.toLocaleDateString("id-ID")}</p>
                        </div>
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

        <div className="mt-15"></div>

        <div className="fixed bottom-10 justify-end">
          <button className="p-2 text-white bg-green-400 rounded hover:cursor-pointer hover:text-black hover:bg-green-200" onClick={handlePopUp}>
            Add Todo
          </button>
        </div>
        {isMounted && popUp && <CreateTodo onClose={handleClosePopUp} onSuccess={fetchGetTodo} initialData={editTodo}/>}
      </div>  
    );
}

export default Homepage;