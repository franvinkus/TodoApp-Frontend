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
      alert(error);
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

  const priorityColors: Record<string, string> = {
    Low: "bg-green-100 text-green-800 border-green-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    High: "bg-red-100 text-red-800 border-red-300",
  };

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
                  <div className="flex items-center border-gray-500 gap-x-3 mb-5">
                    <p className="pl-2 text-2xl">{todo.title}</p>
                    <p className={`flex rounded-2xl justify-center p-1 px-4 text-[14px] ${priorityColors[todo.todoPriority]}`}>{todo.todoPriority}</p>
                  </div>

                  <div className="flex flex-row justify-between items-center">
                    <div className="w-5/6 ">
                      <p className="pl-2 mb-4">{todo.description}</p>
                      <div className="grid grid-cols-2 gap-y-1 w-3/4"> 
                          <p className="pl-2 text-xs">Created: {parseApiDate(todo.createdAt)?.toLocaleDateString("id-ID")}</p>
                          <p className="pl-2 text-xs">Finished: {parseApiDate(todo.finishedAt)?.toLocaleDateString("id-ID") ?  parseApiDate(todo.finishedAt)?.toLocaleDateString("id-ID") : "-"}</p>
                          
                          <p className="pl-2 text-xs">Start: {parseApiDate(todo.startDate)?.toLocaleString("id-ID", { dateStyle: 'short', timeStyle: 'short' })}</p>
                          <p className="pl-2 text-xs">End: {parseApiDate(todo.endDate)?.toLocaleString("id-ID", { dateStyle: 'short', timeStyle: 'short' })}</p>
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