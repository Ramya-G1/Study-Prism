export const initialState=null;
export const reducer=(state,action)=>{
    const arr=[];
    if(action.type==="STUDENT")
    {
        arr["type"]="Student";
        arr["payload"]=action.payload;
        return arr;
    }
    if(action.type==="TEACHER"){
        arr["type"]="Teacher";
        arr["payload"]=action.payload;
        return arr;
    } 
    if(action.type==="CLEAR")
    return null;
    return state;
}