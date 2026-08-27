import { getToken } from "@/utils/Auth";
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
}

export interface PostTodoModel {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
}

export interface PutTodoModel {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
}

export interface login{
    username: string;
    password: string;
}

export interface register extends login{
    email: string;
}

const BASE_API = process.env.NEXT_PUBLIC_API_URL ||"http://localhost:7016/api";

export const API_URL = {
    AUTH:{
        Login:`${BASE_API}/User/user-login`,
        Register: `${BASE_API}/User/user-register`
    }
}

axios.interceptors.request.use((config) => {
    const token = getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

export const login = async (req: login) => {
    try{
        const response = await axios.post(API_URL.AUTH.Login, {
            username: req.username,
            password: req.password,
        });
        console.log(response);
        const token = response.data;
        localStorage.setItem("token", token);
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
      params: { title, sort }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const postTodo = async (todoData: PostTodoModel): Promise<Todo[]> => {
    try{
        const response = await axios.post(`${BASE_API}/Todo/Post`, todoData);
        return response.data;
    }catch (error){
        console.error('Error posting todo:', error);
        throw error;
    }
};

export const putTodo = async (id: number, todoData: PutTodoModel): Promise<Todo[]> => {
    try{
        const response = await axios.put(`${BASE_API}/Todo/PutTodo/${id}`, todoData);
        return response.data;
    }catch (error){
        console.error('Error putting todo:', error);
        throw error;
    }
};

export const patchTodo = async (id: number): Promise<Todo[]> => {
    try{
        const response = await axios.put(`${BASE_API}/Todo/PatchTodo/${id}`);
        return response.data;
    }catch (error){
        console.error('Error patching todo:', error);
        throw error;
    }
};

export const deleteTodo = async (id: number): Promise<Todo[]> => {
    try{
        const response = await axios.delete(`${BASE_API}/Todo/DeleteTodo/${id}`);
        return response.data;
    }catch (error){
        console.error('Error deleting todo:', error);
        throw error;
    }
};