import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const FeedbackContext = createContext();

const initialState = {
  feedbacks: [],
  currentFeedback: null,
  pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  filters: { status: '', category: '', priority: '', search: '', sort: '-createdAt' },
  loading: false,
  error: null
};

function feedbackReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FEEDBACKS':
      return { ...state, feedbacks: action.payload.feedbacks, pagination: action.payload.pagination, loading: false };
    case 'SET_CURRENT':
      return { ...state, currentFeedback: action.payload, loading: false };
    case 'ADD_FEEDBACK':
      return { ...state, feedbacks: [action.payload, ...state.feedbacks], loading: false };
    case 'UPDATE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.map(f => f._id === action.payload._id ? action.payload : f),
        currentFeedback: state.currentFeedback?._id === action.payload._id ? action.payload : state.currentFeedback,
        loading: false
      };
    case 'DELETE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.filter(f => f._id !== action.payload),
        loading: false
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function FeedbackProvider({ children }) {
  const [state, dispatch] = useReducer(feedbackReducer, initialState);

  const fetchFeedbacks = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const queryParams = {
        page: params.page || state.filters.page || 1,
        limit: params.limit || state.pagination.limit,
        ...state.filters,
        ...params
      };
      // Remove empty values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === undefined) delete queryParams[key];
      });

      const res = await api.get('/feedback', { params: queryParams });
      dispatch({ type: 'SET_FEEDBACKS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.error || 'Failed to fetch feedback' });
    }
  }, [state.filters, state.pagination.limit]);

  const fetchFeedback = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.get(`/feedback/${id}`);
      dispatch({ type: 'SET_CURRENT', payload: res.data.feedback });
      return res.data.feedback;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.error || 'Failed to fetch feedback' });
      throw err;
    }
  };

  const createFeedback = async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/feedback', data);
      dispatch({ type: 'ADD_FEEDBACK', payload: res.data.feedback });
      return res.data.feedback;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.error || 'Failed to create feedback' });
      throw err;
    }
  };

  const updateFeedback = async (id, data) => {
    try {
      const res = await api.put(`/feedback/${id}`, data);
      dispatch({ type: 'UPDATE_FEEDBACK', payload: res.data.feedback });
      return res.data.feedback;
    } catch (err) {
      throw err;
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await api.delete(`/feedback/${id}`);
      dispatch({ type: 'DELETE_FEEDBACK', payload: id });
    } catch (err) {
      throw err;
    }
  };

  const toggleUpvote = async (id) => {
    try {
      const res = await api.post(`/feedback/${id}/upvote`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const addComment = async (id, text) => {
    try {
      const res = await api.post(`/feedback/${id}/comment`, { text });
      return res.data.comments;
    } catch (err) {
      throw err;
    }
  };

  const deleteComment = async (feedbackId, commentId) => {
    try {
      const res = await api.delete(`/feedback/${feedbackId}/comment/${commentId}`);
      return res.data.comments;
    } catch (err) {
      throw err;
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  return (
    <FeedbackContext.Provider value={{
      ...state,
      fetchFeedbacks,
      fetchFeedback,
      createFeedback,
      updateFeedback,
      deleteFeedback,
      toggleUpvote,
      addComment,
      deleteComment,
      setFilters,
      resetFilters
    }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error('useFeedback must be used within FeedbackProvider');
  return context;
};

export default FeedbackContext;
