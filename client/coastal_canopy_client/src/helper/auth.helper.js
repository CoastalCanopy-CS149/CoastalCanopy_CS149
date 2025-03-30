export const getLoggedUser = () => {
    if(localStorage.getItem("user")){
        return JSON.parse(localStorage.getItem("user"));
    }
}