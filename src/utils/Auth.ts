export const getToken = () => {
    if(typeof window !== "undefined"){
        return localStorage.getItem("token");
    }
    return null;
}

export const isLoggedIn = () => {
    const token = getToken();
    return token !== null;
}

export const getUserName = () => {
    const token = getToken();
    if(!token) return null;

    try{
        const payloadBase64 = token.split('.')[1];
        const decodeJson = atob(payloadBase64);
        const payload = JSON.parse(decodeJson);
        console.log(payload);

        const username = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.name;

        return username;
    } catch(error){
        console.error("Gagal membaca token:", error);
        return null;
    }
}