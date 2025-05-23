import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// localStorage에서 초기 상태를 가져오는 함수
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('userState');
        if (serializedState === null) {
            return {
                user: null,
                isLoggedIn: false
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            user: null,
            isLoggedIn: false
        };
    }
};

const initialState = loadState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            console.log('loginSuccess 액션 페이로드:', action.payload);
            state.isLoggedIn = true;
            state.user = {
                uName: action.payload.uName,
                uEmail: action.payload.uEmail,
                uRole: action.payload.uRole,
                deletedAt: action.payload.deletedAt
            };
            
            // localStorage에 상태 저장
            const currentState = {
                user: {
                    uName: action.payload.uName,
                    uEmail: action.payload.uEmail,
                    uRole: action.payload.uRole,
                    deletedAt: action.payload.deletedAt
                },
                isLoggedIn: true
            };
            console.log('저장할 상태:', currentState);
            localStorage.setItem('userState', JSON.stringify(currentState));
            localStorage.setItem('accessToken', action.payload.accessToken);
        },
        loginFailure: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            localStorage.removeItem('userState');
            localStorage.removeItem('accessToken');
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            localStorage.removeItem('userState');
            localStorage.removeItem('accessToken');
            delete axios.defaults.headers.common['Authorization'];
        },
        updateUserInfo: (state, action) => {
            state.user = {
                ...state.user,
                uName: action.payload.uName,
                uEmail: action.payload.uEmail,
                uRole: action.payload.uRole,
                deletedAt: action.payload.deletedAt
            };
            
            // localStorage 업데이트
            const currentState = {
                user: {
                    ...state.user,
                    uName: action.payload.uName,
                    uEmail: action.payload.uEmail,
                    uRole: action.payload.uRole,
                    deletedAt: action.payload.deletedAt
                },
                isLoggedIn: true
            };
            localStorage.setItem('userState', JSON.stringify(currentState));
        },
        setUser: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        }
    }
});

export const { loginSuccess, loginFailure, logout, updateUserInfo, setUser } = authSlice.actions;
export default authSlice.reducer;