export const errorHandler = {
  // Extract error message
  getErrorMessage: (error) => {
    if (error.response) {
      // Server responded with error
      return error.response.data?.message || error.response.data?.error || 'Something went wrong';
    } else if (error.request) {
      // Request made but no response
      return 'No response from server. Please check your connection.';
    } else {
      // Error in request setup
      return error.message || 'An unexpected error occurred';
    }
  },

  // Handle API errors
  handleApiError: (error, showToast) => {
    const message = errorHandler.getErrorMessage(error);
    
    if (showToast) {
      showToast(message, 'error');
    }
    
    // Log error for debugging
    console.error('API Error:', error);
    
    return message;
  }
};

