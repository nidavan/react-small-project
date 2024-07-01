// src/components/StaffDialog.js
import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StaffDialog = ({ open, onClose, onSave, staff }) => {
    const formik = useFormik({
        initialValues: {
            id: staff ? staff.id : '',
            fullName: staff ? staff.fullName : '',
            birthday: staff ? staff.birthday : '',
            gender: staff ? staff.genderId : 1,
        },
        validationSchema: Yup.object({
            id: Yup.string().trim()
                .max(8, 'Must be 8 characters or less')
                .required('Required'),
            fullName: Yup.string().trim()
                .max(100, 'Must be 100 characters or less')
                .required('Required'),
            birthday: Yup.date()
                .required('Required'),
            gender: Yup.number()
                .oneOf([1, 2], 'Invalid gender')
                .required('Required'),
        }),
        onSubmit: (values) => {
            onSave(values);
        },
    });

    useEffect(() => {
        if (staff) {
            formik.setValues({
                id: staff.id,
                fullName: staff.fullName,
                birthday: staff.birthday,
                gender: staff.genderId,
            });
        } else {
            formik.resetForm();
        }
    }, [staff, open]);

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>{staff ? 'Update Staff' : 'Add Staff'}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        // autoFocus
                        margin="dense"
                        label="Staff ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        {...formik.getFieldProps('id')}
                        error={formik.touched.id && Boolean(formik.errors.id)}
                        helperText={formik.touched.id && formik.errors.id}
                    />
                    <TextField
                        margin="dense"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        {...formik.getFieldProps('fullName')}
                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                        helperText={formik.touched.fullName && formik.errors.fullName}
                    />
                    <TextField
                        margin="dense"
                        label="Birthday"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        {...formik.getFieldProps('birthday')}
                        error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                        helperText={formik.touched.birthday && formik.errors.birthday}
                    />
                    <TextField
                        margin="dense"
                        label="Gender"
                        select
                        fullWidth
                        variant="outlined"
                        {...formik.getFieldProps('gender')}
                        error={formik.touched.gender && Boolean(formik.errors.gender)}
                        helperText={formik.touched.gender && formik.errors.gender}
                    >
                        <MenuItem value={1}>Male</MenuItem>
                        <MenuItem value={2}>Female</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        style={{ color: "#6B778C" }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ color: "white" }}
                        type="submit"
                    >
                        {staff ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default StaffDialog;
