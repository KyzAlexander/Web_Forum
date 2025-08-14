import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../axios/axiosConfig";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await api.get("/users");
  return response.data;
});

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId: number) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUserProfile: (
      state,
      action: PayloadAction<{ id: number; name: string; email: string }>
    ) => {
      const { id, name, email } = action.payload;
      const user = state.users.find((user) => user.id === id);
      if (user) {
        user.name = name;
        user.email = email;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateUserProfile } = usersSlice.actions;
export default usersSlice.reducer;
