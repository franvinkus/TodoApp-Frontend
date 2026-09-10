import axios from "axios";

export interface Todo {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  finishedAt: Date,
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  todoPriority: string;
}

export interface PostTodoModel {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface PutTodoModel {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface login{
    username: string;
    password: string;
}

export interface register extends login{
    email: string;
}


const BASE_API =  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5020/api" || "http://localhost:7016/api";

axios.defaults.withCredentials = true;

export const API_URL = {
    AUTH:{
        Login:`${BASE_API}/User/user-login`,
        Register: `${BASE_API}/User/user-register`,
        Logout: `${BASE_API}/User/user-logout`
    }
}

export const login = async (req: login) => {
    try{
        const response = await axios.post(API_URL.AUTH.Login, {
            username: req.username,
            password: req.password,
        },
        {
            withCredentials: true 
        });
        console.log(response);
        const username = response.data.username;
        localStorage.setItem("username", username);
        return true;
    } catch(error){
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error("Username atau password salah!");
            }
        }
        
        throw error;
    }
}

export const logout = async() => {
    try{
        const response = await axios.post(API_URL.AUTH.Logout);
        console.log(response);
        return true;
    }catch(error){
        console.log("Error logging out", error);
        throw error;
    }
}

export const register = async (req: register) => {
    try{
        const response = await axios.post(API_URL.AUTH.Register, {
            email: req.email,
            username: req.username,
            password: req.password,
        });
        console.log(response);
        return true;
    }catch(error){
        if (axios.isAxiosError(error)) {
           console.log('error cuy: ', error);
        }
        
        throw error;
    }
}

export const getTodos = async (title?: string, sort?: string): Promise<Todo[]> => {
  try {
    const response = await axios.get<Todo[]>(`${BASE_API}/Todo/Get`, {
      params: { title, sort },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const postTodo = async (todoData: PostTodoModel): Promise<Todo[]> => {
    try{
        const response = await axios.post(`${BASE_API}/Todo/Post`, todoData, {
            withCredentials: true
        });
        return response.data;
    }catch (error){
        console.error('Error posting todo:', error);
        throw error;
    }
};

export const putTodo = async (id: number, todoData: PutTodoModel): Promise<Todo[]> => {
    try{
        const response = await axios.put(`${BASE_API}/Todo/PutTodo/${id}`, todoData, {
            withCredentials: true
        });
        return response.data;
    }catch (error){
        console.error('Error putting todo:', error);
        throw error;
    }
};

export const patchTodo = async (id: number): Promise<Todo[]> => {
    try{
        const response = await axios.put(`${BASE_API}/Todo/PatchTodo/${id}`, null, {
            withCredentials: true
        });
        return response.data;
    }catch (error){
        console.error('Error patching todo:', error);
        throw error;
    }
};

export const deleteTodo = async (id: number): Promise<Todo[]> => {
    try{
        const response = await axios.delete(`${BASE_API}/Todo/DeleteTodo/${id}`, {
            withCredentials: true
        });
        return response.data;
    }catch (error){
        console.error('Error deleting todo:', error);
        throw error;
    }
};