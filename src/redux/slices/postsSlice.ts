import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../axios/axiosConfig";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  liked: boolean;
  disliked: boolean;
  favorite: boolean;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await api.get("/posts");
  return response.data;
});

export const fetchPostsByUserId = createAsyncThunk(
  "posts/fetchPostsByUserId",
  async (userId: number) => {
    const response = await api.get(`/posts?userId=${userId}`);
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Omit<Post, "id">>) => {
      const newPost = {
        id: state.posts.length + 1,
        ...action.payload,
      };
      state.posts.push(newPost);
    },
    deletePost: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    toggleLike: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.liked = !post.liked;
        if (post.liked) {
          post.disliked = false;
        }
      }
    },
    toggleDislike: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.disliked = !post.disliked;
        if (post.disliked) {
          post.liked = false;
        }
      }
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.favorite = !post.favorite;
      }
    },

    movePostToTop: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      const index = state.posts.findIndex((post) => post.id === postId);
      if (index !== -1) {
        const [post] = state.posts.splice(index, 1);
        state.posts.unshift(post);
      }
    },
    swapPosts: (
      state,
      action: PayloadAction<{
        userId: number;
        postId1: number;
        postId2: number;
      }>
    ) => {
      const { postId1, postId2 } = action.payload;
      const index1 = state.posts.findIndex((post) => post.id === postId1);
      const index2 = state.posts.findIndex((post) => post.id === postId2);

      if (index1 !== -1 && index2 !== -1) {
        [state.posts[index1], state.posts[index2]] = [
          state.posts[index2],
          state.posts[index1],
        ];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load posts";
      });
  },
});

export const deletePostById = (postId: number) => (dispatch: any) => {
  dispatch(deletePost(postId));
};
export const {
  addPost,
  deletePost,
  toggleLike,
  toggleDislike,
  toggleFavorite,
  movePostToTop,
  swapPosts,
} = postsSlice.actions;
export default postsSlice.reducer;
