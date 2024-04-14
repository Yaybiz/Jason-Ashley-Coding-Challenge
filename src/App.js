import React, { useState } from 'react';
import RecordTable from './RecordTable';
import { Snackbar } from '@mui/material';

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State to control the visibility of the add record modal
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleModalClose = () => {
    setIsAddModalOpen(false); // Close the add record modal
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="App">
      <h1>Record Management</h1>
      <RecordTable
        isAddModalOpen={isAddModalOpen} // Pass the state of the add record modal to the RecordTable component
        onModalClose={handleModalClose} // Pass the function to close the modal to the RecordTable component
        onSnackbarOpen={handleSnackbarOpen}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
}

export default App;