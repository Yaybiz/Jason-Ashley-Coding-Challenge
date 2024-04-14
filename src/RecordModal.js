//Imports
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import axios from 'axios';
import './App.css'; 

// Record Modal component
const RecordModal = ({ record, open, onClose, onUpdate, onDelete, onRecordChange, onSnackbarOpen }) => {

    // State for edited name
    const [editedName, setEditedName] = useState(record?.name || '');
    // State for edited check
    const [editedCheck, setEditedCheck] = useState(record?.check || false);
    // State for edit mode
    const [isEditMode, setIsEditMode] = useState(false);
  
    // Effect to update the editedName state when a new record is selected
    useEffect(() => {
      if (record) {
        setEditedName(record.name || '');
        setEditedCheck(record.check || false);
      }
    }, [record]);

    // Function to handle name change of selected record
    const handleNameChange = (event) => {
      setEditedName(event.target.value);
    };
  
    // Function to handle check change of selected record
    const handleCheckChange = (event) => {
      setEditedCheck(event.target.value === 'true');
    };

    // Function to handle edit button and enable edit mode
    const handleEditClick = () => {
      setIsEditMode(true);
    };

    // Function to handle cancel button
    const handleCancelClick = () => {
      setEditedName(record?.name || '');
      setEditedCheck(record?.check || false);
      setIsEditMode(false);
    };

    // Function to handle delete button
    const handleDeleteClick = async () => {
      try {
        await axios.delete(`https://test.epdet.org/api/applicant?id=${record._id}`);
        onDelete(record._id);
        onClose();
        onSnackbarOpen(`Successfully removed record: ${record._id}`);
        onRecordChange('delete', record);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    };

    // Function to handle save button
    const handleSaveClick = async () => {
      try {
        const response = await axios.patch(`https://test.epdet.org/api/applicant?id=${record._id}`, {
          name: editedName,
          check: editedCheck,
          date: new Date().toISOString(),
        });
        onUpdate(record._id, editedName, editedCheck, response.data.date);
        setIsEditMode(false);
        onSnackbarOpen(`Successfully updated record: ${record._id}`);
        onRecordChange('edit', { ...record, name: editedName, check: editedCheck, date: response.data.date });
        onClose();
      } catch (error) {
        console.error('Error updating record:', error);
      }
    };

    // Function to handle close button
    const handleCloseClick = () => {
      onClose();
    };

    return (
      <>
        <Modal open={open} onClose={onClose}>
          <Box className="recordModalBox">
            <Typography className="recordModalHeading" variant="h5" gutterBottom>
              {isEditMode ? 'Edit Record' : 'Record Details'}
            </Typography>
            {isEditMode ? (
              <>
                <TextField
                  label="Name"
                  value={editedName}
                  onChange={handleNameChange}
                  fullWidth
                  margin="normal"
                />
                <RadioGroup aria-label="check" name="check" value={editedCheck.toString()} onChange={handleCheckChange}>
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
                <div className="recordModalButtonGroup">
                  <Button className="recordModalButton" variant="contained" onClick={handleSaveClick}>
                    Save
                  </Button>
                  <Button className="recordModalButton" variant="contained" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Typography>ID: {record?._id}</Typography>
                <Typography>Name: {record?.name}</Typography>
                <Typography>Date: {record?.date}</Typography>
                <Typography>Check: {record?.check ? 'Yes' : 'No'}</Typography>
                <div className="recordModalButtonGroup">
                  <Button className="recordModalButton" variant="contained" onClick={handleEditClick}>
                    Edit
                  </Button>
                  <Button className="recordModalButton" variant="contained" onClick={handleDeleteClick}>
                    Delete
                  </Button>
                  <Button className="recordModalButton" variant="contained" onClick={handleCloseClick}>
                    Exit
                  </Button>
                </div>
              </>
            )}
          </Box>
        </Modal>
      </>
    );
  };

export default RecordModal;