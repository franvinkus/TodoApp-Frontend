import axios from "axios";

export interface Todo {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  finishedAt: Date,
  isCompleted: boolean;
}

export interface PostTodoModel {
  title: string;
  description: string;
}

export interface PutTodoModel {
  title: string;
  description: string;
}

const BASE_URL = "http://localhost:5020/api/Todo";

export const getTodos = async (title?: string, sort?: string): Promise<Todo[]> => {
  try {
    const response = await axios.get<Todo[]>(`${BASE_URL}/Get`, {
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
        const response = await axios.post(`${BASE_URL}/Post`, todoData);
        return response.data;
    }catch (error){
        console.error('Error posting todo:', error);
        throw error;
    }
};

export const putTodo = async (id: number, todoData: PutTodoModel): Promise<Todo[]> => {
    try{
        const response = await axios.put(`${BASE_URL}/PutTodo/${id}`, todoData);
        return response.data;
    }catch (error){
        console.error('Error putting todo:', error);
        throw error;
    }
};

export const patchTodo = async (id: number): Promise<Todo[]> => {
    try{
        const response = await axios.put(`${BASE_URL}/PatchTodo/${id}`);
        return response.data;
    }catch (error){
        console.error('Error patching todo:', error);
        throw error;
    }
};

export const deleteTodo = async (id: number): Promise<Todo[]> => {
    try{
        const response = await axios.delete(`${BASE_URL}/DeleteTodo/${id}`);
        return response.data;
    }catch (error){
        console.error('Error deleting todo:', error);
        throw error;
    }
};