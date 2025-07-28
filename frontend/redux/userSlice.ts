import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User{
    _id:string,
    name:string,
    email:string,
    password:string
}

interface AuthState{
    token:string | null,
    user:User | null,
    isAuthenticated:boolean
}

const initialState :AuthState = {
    token:Cookies.get("authToken") || null,
    user:null,
    isAuthenticated:false
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        loginSuccess:(state,action:PayloadAction<{accessToken:string, user:User | null, isAuthenticated:boolean}>)=>{
            state.token = action.payload.accessToken,
            state.user = action.payload.user,
            state.isAuthenticated = action.payload.isAuthenticated,
            Cookies.set("authToken",action.payload.accessToken,{expires:15/1440})

        },
        logout:(state)=>{
            state.token = null,
            state.user = null,
            state.isAuthenticated=false,
            Cookies.remove('authToken')

        }
    }
})

export const {loginSuccess,logout} = userSlice.actions;
export default userSlice.reducer;