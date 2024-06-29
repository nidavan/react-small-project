import React, { useState, useEffect } from "react";
import { db } from "./fierbase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import Button from '@mui/material/Button';
import Add from "@mui/icons-material/Add";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import StaffDialog from './components/StaffDialog';

const CrudApp = () => {
    const [staff, setStaff] = useState([]);
    const [formData, setFormData] = useState({
        staffId: '',
        fullName: '',
        birthday: '',
        genderId: 1
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentStaff, setCurrentStaff] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const staffCollectionRef = collection(db, "staff");

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const data = await getDocs(staffCollectionRef);
        setStaff(data.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                dataId: doc.id,
                genderId: data.gender,
                gender: data.gender === 1 ? "Male" : "Female"
            };
        }));
    };

    const createUser = async (staff) => {
        await addDoc(staffCollectionRef, staff);
        getUsers();
        showSnackbar('Staff created successfully', 'success');
    };

    const updateUser = async (id, updatedStaff) => {
        const userDoc = doc(db, "staff", id);
        await updateDoc(userDoc, updatedStaff);
        getUsers();
        showSnackbar('Staff updated successfully', 'success');
    };

    const deleteUser = async (id) => {
        const userDoc = doc(db, "staff", id);
        await deleteDoc(userDoc);
        getUsers();
        showSnackbar('Staff deleted successfully', 'success');
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'fullName', headerName: 'Full Name', width: 300 },
        { field: 'birthday', headerName: 'Birthday', width: 200 },
        { field: 'gender', headerName: 'Gender', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, marginTop: "5px" }}>
                    <Button
                        onClick={() => handleEditClick(params.row)}
                        sx={{ color: 'white', backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => deleteUser(params.row.dataId)}
                        sx={{ color: 'white', backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    const handleAddClick = () => {
        setCurrentStaff(null);
        setDialogOpen(true);
    };

    const handleEditClick = (staff) => {
        setCurrentStaff(staff);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleSave = async (staff) => {
        if (currentStaff) {
            await updateUser(currentStaff.dataId, staff);
        } else {
            await createUser(staff);
        }
        setDialogOpen(false);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <h1>Staff Management</h1>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddClick}
                        sx={{ color: 'white' }}
                    >
                        Add Staff
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ width: '100%' }}>
                        <DataGrid
                            rows={staff}
                            columns={columns}
                            autoHeight
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            slots={{ toolbar: GridToolbar }}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                },
                            }}
                        />

                        {/* <DataGrid
                            rows={staff}
                            columns={columns}
                            autoHeight
                            // disableColumnFilter
                            // disableColumnSelector
                            // disableDensitySelector
                            components={{ Toolbar: GridToolbar }}
                            componentsProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                },
                            }}
                        /> */}
                    </Box>
                </Grid>
            </Grid>
            <StaffDialog
                open={dialogOpen}
                onClose={handleClose}
                onSave={handleSave}
                staff={currentStaff}
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CrudApp;