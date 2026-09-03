"use client"
import React, {useState, useEffect} from "react";
import { deleteTodo, getTodos, patchTodo, Todo } from "../api";
import CreateTodo from "../../component/createTodo"
import TodoCalendar from "../../component/Calendar";
import LoginModal from "@/component/LoginModal";
import { getToken, getUserName, isLoggedIn } from "@/utils/Auth";
import { Circle, CircleCheckBig, Pencil, Plus, Search, Trash } from "lucide-react";

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
  const [todayDate, setTodayDate] = useState("");
  const nameTitle = getUserName();

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

  const formattedTodayDate = () => {
    const today: Date = new Date();
    const todayString = today.toString();
    const parts = todayString.split(" ");
    const date = parts[0];
    const time = parts[1];
    const [day, month, year] = date.split("-");
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-one from-80% to-blue-two/85 to-95% shadow-inner">
      <div className="flex flex-col items-center p-10">
        {isMounted && isModal && (
          <LoginModal onClose={handleCloseModal}/>
        )}

        <div className="flex flex-col justify-start w-full p-1">
          <h1 className="text-5xl text-white">Welcome, {nameTitle}</h1>
          <h1 className="text-xl text-gray-400">A little progress every day adds up.</h1>
        </div>

        <TodoCalendar todos={todos}/>

        <div className="w-full flex flex-col justify-start mb-4 mt-8">
          <p className="text-gray-300 pl-3 text-lg">Your List</p>
          <p className="text-white pl-3 text-3xl">Tasks</p>
        </div>

        <div className="flex items-stretch justify-between mb-5 w-full">
          <div className="flex flex-row items-center align-middle gap-x-3">
            <div className="flex flex-row border text-gray-300 border-gray-300 p-3 rounded-2xl items-center align-middle gap-x-3 w-48 h-12 md:w-full md:h-14">
              <Search className="text-gray-400"/>
              <input
              type="text"
              placeholder="Search Task"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full placeholder:text-gray-300 placeholder:border-none outline-none md:text-base"/>
            </div>

            {/* <button className="bg-gray-100 border border-black p-3 mb-5 rounded-sm hover:cursor-pointer"
            onClick={() => handleSort()}>
              {isOldest? "latest": "oldest"}
            </button> */}
          </div>

          <div className="flex align-middle items-center">
            <button className="text-xs md:text-lg flex flex-row items-center gap-x-2 p-2 px-4 text-green-moss bg-green-500 rounded-xl hover:cursor-pointer hover:bg-green-300" 
            onClick={handlePopUp}
            >
             <Plus/> Add Todo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-10">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div 
              className={`container rounded-2xl mb-8 shadow-md ${!todo.isCompleted ? "bg-silver" : "bg-slate-300/80 opacity-75"}`}
              key={todo.id}
              >
                  <div className="p-4 flex flex-row">
                    <button className={`h-auto text-green-300 ${!todo.isCompleted ? "p-2 rounded hover:cursor-pointer" : "p-2 rounded hover:cursor-pointer"}`}
                    onClick={() => handleFinished(todo.id)}>
                      {!todo.isCompleted ? <Circle/> : <CircleCheckBig />}
                    </button>
                    <div className="w-full">
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-x-3 items-center justify-between mb-2 md:mb-0">
                          <div className="flex flex-col justify-start md:flex-row md:justify-center md:items-center md:gap-x-3">
                            <p className={`pl-2 text-lg md:text-2xl ${!todo.isCompleted ? "" : "line-through"}`}>{todo.title}</p>
                            <p className={`flex rounded-2xl justify-center p-1 px-4 text-[14px] h-fit w-fit ${priorityColors[todo.todoPriority]}`}>{todo.todoPriority}</p>
                          </div>

                          <div className="flex flex-col justify-end md:flex-row">
                            <button className="p-2 text-gray-400 rounded mr-2 hover:cursor-pointer hover:bg-gray-200"
                            onClick={() => handleEditTodo(todo)}>
                              <Pencil/>
                            </button>
                            <button className="p-2 text-gray-400 rounded mr-2 hover:cursor-pointer hover:bg-gray-200"
                            onClick={() => handleDelete(todo.id)}>
                              <Trash/>
                            </button>
                          </div>
                        </div>
                          <p className="pl-2 text-gray-600 mb-4">{todo.description}</p>
                      </div>

                      <div className="flex flex-row justify-between items-center">
                        <div className="w-full">
                          <div className="grid grid-cols-2 gap-y-1 w-3/4 gap-y-2 md:gap-y-1"> 
                              <p className="pl-2 text-xs">Created: {parseApiDate(todo.createdAt)?.toLocaleDateString("id-ID")}</p>
                              <p className="pl-2 text-xs">Finished: {parseApiDate(todo.finishedAt)?.toLocaleDateString("id-ID") ?  parseApiDate(todo.finishedAt)?.toLocaleDateString("id-ID") : "-"}</p>
                              
                              <p className="pl-2 text-xs">Start: {parseApiDate(todo.startDate)?.toLocaleString("id-ID", { dateStyle: 'short', timeStyle: 'short' })}</p>
                              <p className="pl-2 text-xs">End: {parseApiDate(todo.endDate)?.toLocaleString("id-ID", { dateStyle: 'short', timeStyle: 'short' })}</p>
                          </div>
                        </div>

                        
                      </div>
                    </div>
                  </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-white">No todos found.</div>
          )}
        </div>

        <div className="mt-15"></div>

        {isMounted && popUp && <CreateTodo onClose={handleClosePopUp} onSuccess={fetchGetTodo} initialData={editTodo}/>}
      </div>  
    </div>
  );
}

export default Homepage;