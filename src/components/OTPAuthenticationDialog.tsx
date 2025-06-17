import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';

interface OTPAuthenticationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const OTPAuthenticationDialog: React.FC<OTPAuthenticationProps> = ({ isOpen, onClose, onSuccess }) => {
  const [enteredOTP, setEnteredOTP] = useState('');
  const [username, setUsername] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false); // State to manage whether OTP is being sent

  const generateAndSendOTP = async () => {
    try {
      setIsSendingOTP(true); // Disable the "Send OTP" button
      await axios.post('http://localhost:3001/send-otp', { username });
      alert('OTP sent successfully.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP.');
    } finally {
      setIsSendingOTP(false); // Enable the "Send OTP" button
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('http://localhost:3001/verify-otp', { username, otp: enteredOTP });
      if (response.data.success) {
        onSuccess();
        setEnteredOTP(''); // Reset the OTP field to an empty string
        setUsername(''); 
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP.');
    }
  };

  const handleClose = () => {
    setEnteredOTP(''); // Reset the OTP field to an empty string
    setUsername(''); 
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>OTP Authentication</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Enter OTP"
          type="text"
          value={enteredOTP}
          onChange={(e) => setEnteredOTP(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={generateAndSendOTP} disabled={isSendingOTP} color="primary">Send OTP</Button>
        <Button onClick={handleVerifyOTP} color="primary">Verify OTP</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPAuthenticationDialog;
