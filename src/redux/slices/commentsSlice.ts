import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../axios/axiosConfig";

interface Comment {
  id: number;
  postId: number;
  body: string;
}

interface CommentsState {
  comments: Record<number, Comment[]>;
  loading: boolean;
}

const initialState: CommentsState = {
  comments: {},
  loading: false,
};

export const fetchCommentsByPostId = createAsyncThunk(
  "comments/fetchCommentsByPostId",
  async (postId: number) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return { postId, comments: response.data };
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (
      state,
      action: PayloadAction<{ postId: number; body: string }>
    ) => {
      const { postId, body } = action.payload;
      const newComment: Comment = {
        id: Date.now(),
        postId,
        body,
      };
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      state.comments[postId].push(newComment);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
      state.comments[action.payload.postId] = action.payload.comments;
    });
  },
});

export const { addComment } = commentsSlice.actions;
export default commentsSlice.reducer;
