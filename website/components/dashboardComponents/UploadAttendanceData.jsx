import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from "@mui/material";

const UploadAttendanceData = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile && (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.type === "application/vnd.ms-excel")) {
            setFile(selectedFile);
            setError("");
        } else {
            setFile(null);
            setError("Invalid file type. Please upload an Excel file (.xlsx, .xls).");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file); // The name should be 'file' as per your backend requirement

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/api/v1/attendance/upload-excel", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Upload Success:", response.data);
            alert("File uploaded successfully!");
            onClose();
        } catch (err) {
            console.error("Upload Error:", err);
            alert("Failed to upload file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Upload Employee Data</DialogTitle>
            <DialogContent>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                {file && <Typography variant="body2">Selected File: {file.name}</Typography>}
                {error && <Typography color="error">{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={loading}>Cancel</Button>
                <Button onClick={handleUpload} color="primary" disabled={!file || loading}>
                {loading ? <CircularProgress size={24} /> : "Upload"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadAttendanceData;
