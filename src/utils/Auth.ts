export const isLoggedIn = () => {
    if(typeof window !== "undefined"){
        return localStorage.getItem("username");
    }
    return null;
}

export const getUserName = () => {
    const username = localStorage.getItem("username");
    if(!username) return null;
    try{
        return username;
    } catch(error){
        console.error("Gagal membaca username:", error);
        return null;
    }
}