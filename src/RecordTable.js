// Imports
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import RecordModal from './RecordModal';
import AddRecordModal from './AddRecordModal';
import { Button } from '@mui/material';
import './App.css'; // Import the CSS file

const RecordTable = ({ onSnackbarOpen }) => {
  // State variables
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);

  // Fetch records from the API on component mount
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('https://test.epdet.org/api/applicant');
        // Add rowId to each record for DataGrid
        const recordsWithId = response.data.map((record, index) => ({
          ...record,
          rowId: index + 1,
        }));
        setRecords(recordsWithId);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  // Handle row click event
  const handleRowClick = (params) => {
    setSelectedRecord(params.row);
    setIsModalOpen(true);
    setIsNewRecordModalOpen(false);
  };

  // Handle record deletion
  const handleDeleteRecord = (recordId) => {
    setRecords(records.filter((record) => record._id !== recordId)); //Filter record array for the existing id
    onSnackbarOpen(`Successfully removed record: ${recordId}`);
  };

  // Handle modal close event
  const handleModalClose = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
    setIsNewRecordModalOpen(false);
  };

  // Handle adding a new record
  const handleAddRecord = () => {
    setIsNewRecordModalOpen(true);
    setIsModalOpen(false);
  };

  // Handle updating a record
  const handleUpdateRecord = (id, name, check, date) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record._id === id ? { ...record, name, check, date } : record
      )
    );
  };

  // Handle record change event (edit or add)
  const handleRecordChange = (action, updatedRecord) => {
    if (action === 'edit') {
      // Update an existing record
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === updatedRecord._id ? updatedRecord : record
        )
      );
    } else if (action === 'add') {
      // Add a new record
      setRecords((prevRecords) => [...prevRecords, updatedRecord]);
    }
  };

  return (
    <>
      <div className="recordTableContainer">
        {/* DataGrid to display records */}
        <DataGrid
          rows={records}
          columns={[
            { field: 'name', headerName: 'Name', width: 200, sortable: false },
            { field: 'date', headerName: 'Date', width: 150 },
            { field: 'check', headerName: 'Check', width: 150 },
          ]}
          pageSize={5}
          onRowClick={handleRowClick}
          getRowId={(row) => row.rowId}
        />
        {/* Button to add a new record */}
        <Button
          className="recordTableButton"
          variant="contained"
          onClick={handleAddRecord}
        >
          Add New Record
        </Button>
      </div>
      {/* RecordModal for viewing/editing a record */}
      <RecordModal
        record={selectedRecord}
        open={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleUpdateRecord}
        onDelete={handleDeleteRecord}
        onRecordChange={handleRecordChange}
        onSnackbarOpen={onSnackbarOpen}
      />
      {/* AddRecordModal for adding a new record */}
      <AddRecordModal
        open={isNewRecordModalOpen}
        onClose={handleModalClose}
        onRecordChange={handleRecordChange}
        onSnackbarOpen={onSnackbarOpen}
      />
    </>
  );
};

export default RecordTable;