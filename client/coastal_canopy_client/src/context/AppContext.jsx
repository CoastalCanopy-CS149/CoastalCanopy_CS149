import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Create the AppContext
const AppContext = createContext(undefined);

// AppProvider Component
export const AppProvider = ({ children }) => {
  const [errors, setErrors] = useState([]); // Array to collect errors
  const [successes, setSuccesses] = useState([]); // Array to collect success messages

  // Function to add an error
  const addError = (error) => {
    setErrors((prevErrors) => [...prevErrors, error]);
  };

  // Function to add a success message
  const addSuccess = (message) => {
    setSuccesses((prevSuccesses) => [...prevSuccesses, message]);
  };

  // Function to clear all errors (optional)
  const clearErrors = () => {
    setErrors([]);
  };

  // Function to clear all successes (optional)
  const clearSuccesses = () => {
    setSuccesses([]);
  };

  // Effect to display errors with SweetAlert2
  useEffect(() => {
    if (errors.length > 0) {
      const latestError = errors[errors.length - 1];
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: typeof latestError === 'string' ? latestError : latestError.message || 'An unexpected error occurred',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33', // Red for errors
        timer: 5000,
        timerProgressBar: true,
        background: '#fff',
        customClass: {
          popup: 'animated bounceIn',
        },
      }).then(() => {
        // Optionally clear errors after displaying (uncomment if desired)
        // setErrors([]);
      });
    }
  }, [errors]);

  // Effect to display success messages with SweetAlert2
  useEffect(() => {
    if (successes.length > 0) {
      const latestSuccess = successes[successes.length - 1];
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: typeof latestSuccess === 'string' ? latestSuccess : latestSuccess.message || 'Operation completed successfully',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6', // Blue for success
        timer: 3000,
        timerProgressBar: true,
        background: '#fff',
        customClass: {
          popup: 'animated bounceIn',
        },
      }).then(() => {
        // Optionally clear successes after displaying (uncomment if desired)
        // setSuccesses([]);
      });
    }
  }, [successes]);

  // Context value
  const value = {
    errors,
    addError,
    clearErrors,
    successes,
    addSuccess,
    clearSuccesses,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};