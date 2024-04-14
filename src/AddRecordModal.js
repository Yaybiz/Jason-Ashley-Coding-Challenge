import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import axios from 'axios';
import './App.css'; // Import the CSS file

// AddRecordModal Component
const AddRecordModal = ({ record, open, onClose, onRecordChange, onSnackbarOpen }) => {
    // State for the name input field
    const [editedName, setEditedName] = useState(record?.name || '');

    // State for the check radio button
    const [editedCheck, setEditedCheck] = useState(record?.check || false);

    // Function to handle changes in the name input field
    const handleNameChange = (event) => {
        setEditedName(event.target.value);
    };

    // Function to handle changes in the check radio button
    const handleCheckChange = (event) => {
        setEditedCheck(event.target.value === 'true');
    };

    // Function to handle saving the record
    const handleSaveClick = async () => {
      try {
          // Check if the name field is empty
          if (!editedName.trim()) {
              // Display a notification using the function passed from App.js
              onSnackbarOpen('Please fill out the name field.');
              return; // Exit the function early
          }

          // Send a POST request to add the new record
          const response = await axios.post(`https://test.epdet.org/api/applicant`, {
              name: editedName,
              check: editedCheck,
              date: new Date().toISOString(),
          });

          // Display a snackbar message after successfully adding the record
          onSnackbarOpen(`Successfully added record: ${response.data._id}`);

          // Notify the parent component about the record addition
          onRecordChange('add', { ...response.data, rowId: response.data._id });

          // Close the modal
          onClose();
      } catch (error) {
          console.error('Error adding record:', error);
      }
    };

    // Function to handle canceling the addition of the record
    const handleCancelClick = () => {
        // Reset the name and check states
        setEditedName('');
        setEditedCheck(false);

        // Close the modal
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className="modalBox"> 
                <Typography className="modalHeading" variant="h5" gutterBottom>
                    Add New Record
                </Typography>
                {/* Name input field */}
                <TextField
                    label="Name"
                    value={editedName}
                    onChange={handleNameChange}
                    fullWidth
                    margin="normal"
                />
                {/* Check radio button group */}
                <RadioGroup aria-label="check" name="check" value={editedCheck.toString()} onChange={handleCheckChange}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
                {/* Save and cancel buttons */}
                <div className="modalButtonGroup"> 
                    <Button className="modalButton" variant="contained" onClick={handleSaveClick}>
                        Save
                    </Button>
                    <Button className="modalButton" variant="contained" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default AddRecordModal;