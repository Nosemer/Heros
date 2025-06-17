  import { FunctionComponent, useState, ChangeEvent, FormEvent, useEffect } from "react";
  import {
    TextField,
    InputAdornment,
    Icon,
    IconButton,
    Select,
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
    Button,
    SelectChangeEvent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
  } from "@mui/material";
  import DeleteIcon from '@mui/icons-material/Delete';
  import EditIcon from '@mui/icons-material/Edit';
  import axios from 'axios';
  import styles from "./Admin.module.css";
  import SideNavigation from "../Usercomponents/Sidenav";
  import Header from "../Usercomponents/Header";
  import validator from 'validator';
  import { confirmAlert } from "react-confirm-alert";
  import AddIcon from '@mui/icons-material/Add';
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
  import OTPAuthenticationDialog from "../components/OTPAuthenticationDialog";
  
  interface UserData {
    ID: number;
    First_Name: string;
    Last_Name: string;
    Username: string;
    Password: string;
    Confirm_Password: string;
    Email: string;
    Sex: string;
    Position: string;
    passwordError: boolean,
    usernameError: string;
    passwordErrorText: string;
    contactError: string;
  }
  const initialUserData: UserData = {
    ID: 0,
    First_Name: '',
    Last_Name: '',
    Username: '',
    Password: '',
    Confirm_Password: '',
    Email: '',
    Sex: '',
    Position: '',
    passwordError: false,
    usernameError: '',
    passwordErrorText: '',
    contactError: '',
  };
  const initialAdminData: UserData = {
    ID: 0,
    First_Name: '',
    Last_Name: '',
    Username: '',
    Password: '',
    Confirm_Password: '',
    Email: '',
    Sex: '',
    Position: '',
    passwordError: false,
    usernameError: '',
    passwordErrorText: '',
    contactError: '',
  };
  const Admin: FunctionComponent = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserData>({
      ID: 0,
      First_Name: "",
      Last_Name: "",
      Username: "",
      Password: "",
      Confirm_Password: "",
      Email: "",
      Sex: "",
      Position: "Admin",
      passwordError: false,
      usernameError: '',
      passwordErrorText: '',
      contactError: '',
    });
    const [users, setUsers] = useState<UserData[]>([]);
    const [Admin, setAdmin] = useState<UserData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(Admin.length / itemsPerPage);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [editData, setEditData] = useState<UserData | null>(initialUserData);
    const [editAdminId, setEditAdminId] = useState<number | null>(null);
    const [editAdminData, setEditAdminData] = useState<UserData | null>(initialAdminData);
    const [usernameError, setUsernameError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [originalEditData, setOriginalEditData] = useState<UserData | null>(null);
    const [originalEditAdminData, setOriginalEditAdminData] = useState<UserData | null>(null);
    const [isOTPDialogOpen, setOTPDialogOpen] = useState(false); // State for OTP dialog
    const [OTPVerificationSuccess, setOTPVerificationSuccess] = useState(false);
    const [operation, setOperation] = useState<string>('');
    const [adminId, setAdminId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    // Function to fetch users
  const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    // Function to fetch admin data
  const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/admin");
        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    // useEffect to fetch data on component mount
    useEffect(() => {
      fetchData();
      fetchAdminData();
      
      if (formData.Username !== '') {
        validateField('Username', formData.Username, formData.Position);
      }
    
      // Validate password on change
      if (formData.Password !== '') {
        validateField('Password', formData.Password, formData.Position);
      }
    
      // Validate contact number on change
      if (formData.Email !== '') {
        validateField('Email', formData.Email, formData.Position);
      }
    }, [formData.Username, formData.Password, formData.Email, formData.Position]);
    
  const handleShowPasswordClick = () => {
      setShowPassword(!showPassword);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  
      // Validate fields as they are being typed
      validateField(name, value, formData.Position);
    };
    const validateField = async (name: string, value: string, position: string) => {
      console.log('Validating field:', name, 'with value:', value, 'for position:', position);
      
      let error = '';
      let endpoint = '';
    
      if (position === 'Admin') {
        endpoint = 'http://localhost:3001/api/admin';
      } else {
        endpoint = 'http://localhost:3001/api';
      }
      
      switch (name) {
        case 'Username':
          if (!validator.isAlphanumeric(value)) {
            error = 'Username must be alphanumeric';
          } else {
            try {
              const response = await axios.post(`${endpoint}/username`, { username: value });
              if (response.data.exists) {
                error = 'Username already exists';
              }
            } catch (error) {
              console.error('Error validating username:', error);
              error = 'Error validating username';
            }
          }
          setUsernameError(error);
          break;
    
        case 'Password':
          if (!validator.isStrongPassword(value)) {
            error = 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters';
          } else {
            try {
              const response = await axios.post(`${endpoint}/Password`, { pass: value });
              if (response.data.exists) {
                error = 'Password already exists';
              }
            } catch (error) {
              console.error('Error validating password:', error);
              error = 'Error validating password';
            }
          }
          setPasswordError(error);
          break;
    
        case 'Email':
          if (!validator.isEmail(value)) {
            error = 'Invalid Email';
          } else {
            try {
              const response = await axios.post(`${endpoint}/Email`, { email: value });
              if (response.data.exists) {
                error = 'Email already exists';
              }
            } catch (error) {
              console.error('Error validating Email:', error);
              error = 'Error validating Email';
            }
          }
          setEmailError(error);
          break;
    
        default:
          break;
      }
    };
    
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      // Only allow letters
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    };
  const handleSexChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Sex: value as string,
    }));
    };
  const handlePositionChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Position: value as string,
    }));
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      // Check if any errors exist
      if (usernameError || passwordError || emailError) {
        alert('Please fix the errors in the form');
        return;
      }
    
      try {
        // Determine the API endpoint based on the position selected
        let apiUrl;
        if (formData.Position === 'Admin') {
          apiUrl = 'http://localhost:3001/api/insert/admin';
        } else {
          apiUrl = 'http://localhost:3001/api/insert/user';
        }
    
        // Send registration data to the backend
        const response = await axios.post(apiUrl, formData);
        if (response.status === 201) {
          alert("Registration successful");
          setFormData(initialUserData);
          fetchData();
          fetchAdminData();
        } else {
          throw new Error("Failed to register");
        }
      } catch (error) {
        console.error("Error registering:", (error as Error).message);
        alert("Error registering. Please try again.");
      }
    };
    
    const handleDeleteUser = async (userId: number) => {
            try {
              const response = await axios.delete(`http://localhost:3001/api/deleteUser/${userId}`);
              console.log(response.data.message); // Log success message

              // Remove deleted user from state
              setUsers(prevUsers => prevUsers.filter(user => user.ID !== userId));
              window.alert("User deleted successfully");
              setFormData(initialUserData);
              fetchData();
            } catch (error) {
              console.error('Error deleting user:', error);
              window.alert("Error deleting user. Please try again."); // Notify user of error
            }
  };
    const handleDeleteAdmin = async (adminId: number) => {
            try {
              const response = await axios.delete(`http://localhost:3001/api/deleteAdmin/${adminId}`);
              console.log(response.data.message); // Log success message
              // Remove deleted user from state
              setUsers(prevUsers => prevUsers.filter(admin => admin.ID !== adminId));
              window.alert("admin deleted successfully");         
              setFormData(initialAdminData);
              fetchAdminData();
            } catch (error) {
              console.error('Error deleting admin:', error);
              alert("Error deleting admin. Please try again."); // Notify user of error
            }
  };
  // Edit User
  const handleEditUser = (userId: number) => {
    const userToEdit = users.find((user) => user.ID === userId);
    if (userToEdit) {
      setEditUserId(userId);
      setEditData(userToEdit);
      setOriginalEditData(userToEdit); // Set original data
    }
  };
  const handleEditUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [name]: value,
      };
    });
  
    // Validate fields as they are being typed
    validateField(name, value, 'User');
  };
  
  const handleEditUserMenuChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setEditData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  const handleEditUserSubmit = async () => {
    if (editData) {
      setUsernameError('');
      setPasswordError('');
      setEmailError('');
       // Validate the fields before submitting the edit request
    validateField('Username', editData.Username, 'User');
    validateField('Password', editData.Password, 'User');
    validateField('Email', editData.Email, 'User');

    // Check if any errors exist
    if (usernameError || passwordError || emailError) {
      alert('Please fix the errors in the form');
      return;
    }
      try {
        const response = await axios.put(`http://localhost:3001/api/editUser/${editUserId}`, {
          firstName: editData.First_Name,
          lastName: editData.Last_Name,
          username: editData.Username,
          password: editData.Password,
          email: editData.Email,
          sex: editData.Sex,
        });

        if (response.status === 200) {
          alert("User updated successfully");
          fetchData();
          setEditUserId(null);
        } else {
          throw new Error("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", (error as Error).message);
        alert("Error updating user. Please try again.");
      }
    }};
  // Edit Admin
  const handleEditAdmin = (adminId: number) => {
    const adminToEdit = Admin.find((admin) => admin.ID === adminId);
    if (adminToEdit) {
      setEditAdminId(adminId);
      setEditAdminData(adminToEdit);
      setOriginalEditAdminData(adminToEdit); // Set original admin data
    }
  };
  const handleEditAdminInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditAdminData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [name]: value,
      };
    });
  
    // Validate fields as they are being typed
    validateField(name, value, 'Admin');
  };
  const handleEditAdminMenuChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setEditAdminData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  const handleEditAdminSubmit = async () => {
    if (editAdminData) {
      setUsernameError('');
      setPasswordError('');
      setEmailError('');
       // Validate the fields before submitting the edit request
    validateField('Username', editAdminData.Username, 'Admin');
    validateField('Password', editAdminData.Password, 'Admin');
    validateField('Email', editAdminData.Email, 'Admin');

    // Check if any errors exist
    if (usernameError || passwordError || emailError) {
      alert('Please fix the errors in the form');
      return;
    }
      try {
        const response = await axios.put(`http://localhost:3001/api/editAdmin/${editAdminId}`, {
          firstName: editAdminData.First_Name,
          lastName: editAdminData.Last_Name,
          username: editAdminData.Username,
          password: editAdminData.Password,
          Email: editAdminData.Email,
          sex: editAdminData.Sex,
        });

        if (response.status === 200) {
          alert("User updated successfully");
          fetchAdminData();
          setEditAdminId(null);
        } else {
          throw new Error("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", (error as Error).message);
        alert("Error updating user. Please try again.");
      }
    }};
    
    const handleCloseEditDialog = () => {
      // Reset edit data to original data
      if (originalEditData) {
        setEditData(originalEditData);
      }
      if (originalEditAdminData) {
        setEditAdminData(originalEditAdminData);
      }
      // Reset errors for the fields
      setUsernameError('');
      setPasswordError('');
      setEmailError('');
      
      // Close the dialog box
      setEditUserId(null);
      setEditAdminId(null);
    };
    
  const handleDeleteUserWithOTP = async (userId: number) => {
    setUserId(userId);
    setOperation('deleteUser');
    setOTPDialogOpen(true);
  };

  const handleEditUserWithOTP = async (userId: number) => {
    setUserId(userId);
    setOperation('editUser');
    setOTPDialogOpen(true);
  };
  const handleDeleteAdminWithOTP= async (adminId: number) => {
    setAdminId(adminId);
    setOperation('deleteAdmin');
    setOTPDialogOpen(true);
  };

  const handleEditAdminWithOTP = async (adminId: number) => {
    setAdminId(adminId);
    setOperation('editAdmin');
    setOTPDialogOpen(true);

  };
  const handleOTPSuccess = async () => {
    setOTPVerificationSuccess(true);
    setOTPDialogOpen(false);
  
    if (operation === 'deleteUser' && userId !== null) {
      await handleDeleteUser(userId);
    } else if (operation === 'editUser' && userId !== null) {
      handleEditUser(userId); 
    } else if (operation === 'deleteAdmin' && adminId !== null) {
      await handleDeleteAdmin(adminId);
    } else if (operation === 'editAdmin' && adminId !== null) {
      handleEditAdmin(adminId);
    }
    setOTPVerificationSuccess(false);
    setOperation('');
    setAdminId(null);
    setUserId(null);
  };
  
    return (
      <form onSubmit={handleSubmit }>
        <div className={styles.admin}>
          <SideNavigation activeLink="admin" isOpen={false} />
          <div className={styles.adminChild} />
          <Header />
          <div className={styles.adminItem} />
          <div className={styles.adminInner} />
          <div className={styles.textFieldsContainer}>
          <div className={styles.registerTitle}>REGISTER</div>
          <TextField
            className={styles.rectangleTextfield}
            color="primary"
            name="First_Name"
            label="First Name"
            type="string"
            required={true}
            value={formData.First_Name}
            onChange={handleTextChange}
            sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
          />
          <TextField
            className={styles.adminChild1}
            color="primary"
            name="Last_Name"
            label="Last Name"
            type="string"
            required={true}
            value={formData.Last_Name}
            onChange={handleTextChange}
            sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
          />
          <TextField
            className={styles.adminChild2}
            color="primary"
            name="Username"
            label="Username"
            required={true}
            value={formData.Username}
            onChange={handleChange}
            error={!!usernameError} // Highlight the field if there's an error
            helperText={usernameError} // Display error message
            sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
          />
          <FormControl
            className={styles.positionParent}
            sx={{
              borderRadius: "0px 0px 0px 0px",
              width: "360px",
              height: "41px",
              m: 0,
              p: 0,
              "& .MuiInputBase-root": {
                m: 0,
                p: 0,
                minHeight: "41px",
                justifyContent: "center",
                display: "inline-flex",
              },
              "& .MuiInputLabel-root": {
                m: 0,
                p: 0,
                minHeight: "41px",
                display: "inline-flex",
              },
              "& .MuiMenuItem-root": {
                m: 0,
                p: 0,
                height: "41px",
                display: "inline-flex",
              },
              "& .MuiSelect-select": {
                m: 0,
                p: 0,
                height: "41px",
                alignItems: "center",
                display: "inline-flex",
              },
              "& .MuiInput-input": { m: 0, p: 0 },
              "& .MuiInputBase-input": { textAlign: "left", p: "0 !important" },
            }}
          >
            <InputLabel color="primary">Position</InputLabel>
            <Select
                color="primary"
                name="Position"
                label="Position"
                displayEmpty
                value={formData.Position} 
                defaultValue="Admin" 
                onChange={handlePositionChange}>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
            </Select>
            <FormHelperText />
          </FormControl>
          <TextField
            className={styles.adminChild3}
            color="primary"
            name="Password"
            label="Password"
            required={true}
            value={formData.Password}
            onChange={handleChange}
            type={showPassword ?  "password": "text"}
            error={!!passwordError} // Highlight the field if there's an error
            helperText={passwordError} // Display error message
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleShowPasswordClick}
                    aria-label="toggle password visibility"
                  >
                    <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
          />
          <TextField
            className={styles.adminChild4}
            color="primary"
            label="Confirm Password"
            variant="outlined"
            required={true}
            type={showPassword ?  "password": "text"}
            name="Confirm_Password" // Corrected name here
            value={formData.Confirm_Password} // Corrected value here
            onChange={handleChange}
            error={!!passwordError} // Highlight the field if there's an error
            helperText={passwordError} // Display error message
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleShowPasswordClick}
                  aria-label="toggle password visibility"
                >
                  <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
                </IconButton>
              </InputAdornment>
            ),
          }}
            sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
          />
          <TextField
            className={styles.adminChild5}
            color="primary"
            name="Email"
            label="Email"
            required={true}
            value={formData.Email}
            onChange={handleChange}
            error={!!emailError} // Highlight the field if there's an error
            helperText={emailError} // Display error message
            sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
          />
          <FormControl
            className={styles.sexParent}
            sx={{
              borderRadius: "0px 0px 0px 0px",
              width: "360px",
              height: "41px",
              m: 0,
              p: 0,
              "& .MuiInputBase-root": {
                m: 0,
                p: 0,
                minHeight: "41px",
                justifyContent: "center",
                display: "inline-flex",
              },
              "& .MuiInputLabel-root": {
                m: 0,
                p: 0,
                minHeight: "41px",
                display: "inline-flex",
              },
              "& .MuiMenuItem-root": {
                m: 0,
                p: 0,
                height: "41px",
                display: "inline-flex",
              },
              "& .MuiSelect-select": {
                m: 0,
                p: 0,
                height: "41px",
                alignItems: "center",
                display: "inline-flex",
              },
              "& .MuiInput-input": { m: 0, p: 0 },
              "& .MuiInputBase-input": { textAlign: "left", p: "0 !important" },
            }}
          >
            <InputLabel color="primary">Sex</InputLabel>
            <Select
              color="primary"
              name="Sex"
              label="Sex"
              displayEmpty
              value={formData.Sex} defaultValue="Male" onChange={handleSexChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            <FormHelperText />
          </FormControl>
          </div>
          <div className={styles.rectangleDiv}> 
          <div className={styles.tableTitle}>USER TABLE</div>
          <div className={styles.paginationControls}>
          <IconButton
                onClick={() => setCurrentPage(prevPage => prevPage > 1 ? prevPage - 1 : 1)}
                disabled={currentPage === 1}
              >
                <ArrowBackIcon />
              </IconButton>
              <span className={styles.pageNumber}>
                {currentPage} / {totalPages}
              </span>
              <IconButton
                onClick={() => setCurrentPage(prevPage => prevPage < totalPages ? prevPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
              >
                <ArrowForwardIcon />
              </IconButton>
          </div>
            <TableContainer style={{ maxHeight: 380, width: '100%' }}>
            <Table aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Sex</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice((currentPage - 1)* 5, currentPage * 5).map((user) => (
        <TableRow key={user.ID}>
          <TableCell>{user.ID}</TableCell>
          <TableCell>{user.First_Name}</TableCell>
          <TableCell>{user.Last_Name}</TableCell>
          <TableCell>{user.Username}</TableCell>
          <TableCell>{user.Email}</TableCell>
          <TableCell>{user.Sex}</TableCell>
          <TableCell>
          <Tooltip title="Delete" arrow placement="top">  
            <IconButton onClick={(event) => handleDeleteUserWithOTP(user.ID)}>
              <DeleteIcon sx={{ color: 'Black' }} />
            </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow placement="top">
            <IconButton onClick={() => handleEditUserWithOTP(user.ID)}>
              <EditIcon sx={{ color: 'grey' }} />
            </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))}
              </TableBody>
            </Table>
          </TableContainer>
  </div>
  <div className={styles.adminInnerRec}>
  <div className={styles.tableTitle}>ADMIN TABLE</div>
  <div className={styles.paginationControls}>
  <IconButton
                onClick={() => setCurrentPage(prevPage => prevPage > 1 ? prevPage - 1 : 1)}
                disabled={currentPage === 1}
              >
                <ArrowBackIcon />
              </IconButton>
              <span className={styles.pageNumber}>
                {currentPage} / {totalPages}
              </span>
              <IconButton
                onClick={() => setCurrentPage(prevPage => prevPage < totalPages ? prevPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
              >
                <ArrowForwardIcon />
              </IconButton>
          </div>
            <TableContainer style={{ maxHeight: 380, width: '100%' }}>
            <Table aria-label="Admin table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Sex</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Admin.slice((currentPage - 1)* 5, currentPage * 5).map((Admin) => (
        <TableRow key={Admin.ID}>
          <TableCell>{Admin.ID}</TableCell>
          <TableCell>{Admin.First_Name}</TableCell>
          <TableCell>{Admin.Last_Name}</TableCell>
          <TableCell>{Admin.Username}</TableCell>
          <TableCell>{Admin.Email}</TableCell>
          <TableCell>{Admin.Sex}</TableCell>
          <TableCell>
          <Tooltip title="Delete" arrow placement="top">
          <IconButton onClick={(event) => handleDeleteAdminWithOTP(Admin.ID)}>
              <DeleteIcon sx={{ color: 'Black' }} />
            </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow placement="top">
            <IconButton onClick={() => handleEditAdminWithOTP(Admin.ID)}>
              <EditIcon sx={{ color: 'grey' }} />
            </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))}
              </TableBody>
            </Table>
          </TableContainer>
  </div>
          <Button
            className={styles.adminChild6}
            disableElevation={true}
            color="primary"
            name="Add"
            variant="contained"
            type="submit"
            startIcon={<AddIcon />}
            sx={{ borderRadius: "0px 0px 0px 0px" }}
          >
            Add
          </Button>
        </div>
        <OTPAuthenticationDialog
  isOpen={isOTPDialogOpen}
  onClose={() => setOTPDialogOpen(false)}
  onSuccess={handleOTPSuccess}

/>
          <Dialog open={editUserId !== null} onClose={() => handleCloseEditDialog}>
          <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {/* Form fields for editing */}
          <TextField
            name="First_Name"
            label="First Name"
            value={(editData as UserData).First_Name || ''}
            onChange={handleEditUserInputChange}
          />
          <TextField
            name="Last_Name"
            label="Last Name"
            value={(editData as UserData).Last_Name || ''}
            onChange={handleEditUserInputChange}
          />
          <TextField
            name="Username"
            label="Username"
            value={(editData as UserData).Username || ''}
            error={!!usernameError} // Highlight the field if there's an error
            helperText={usernameError} // Display error message
            onChange={handleEditUserInputChange}
          />
          <TextField
            name="Email"
            label="Email"
            value={(editData as UserData).Email || ''}
            error={!!emailError} // Highlight the field if there's an error
            helperText={emailError} // Display error message
            onChange={handleEditUserInputChange}
          />
          <FormControl sx={{ width: "222px" }}>
        <InputLabel color="primary">Sex</InputLabel>
        <Select
          color="primary"
          name="Sex"
          label="Sex"
          displayEmpty
          value={(editData as UserData).Sex || ''}
          defaultValue="Male"
          onChange={handleEditUserMenuChange}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
        <FormHelperText />
      </FormControl>
      <TextField
            name="Password"
            label="Password"
            value={(editData as UserData).Password || ''}
            error={!!passwordError} // Highlight the field if there's an error
            helperText={passwordError} // Display error message
            onChange={handleEditUserInputChange}
            type={showPassword ?  "password": "text"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleShowPasswordClick}
                    aria-label="toggle password visibility"
                  >
                    <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditUserSubmit} color="primary">Save</Button>
        <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={editAdminId !== null} onClose={handleCloseEditDialog}>
  <DialogTitle>Edit Admin</DialogTitle>
  <DialogContent>
    {/* Form fields for editing */}
    <TextField
      name="First_Name"
      label="First Name"
      value={(editAdminData as UserData).First_Name || ''}
      onChange={handleEditAdminInputChange}
    />
    <TextField
      name="Last_Name"
      label="Last Name"
      value={(editAdminData as UserData).Last_Name || ''}
      onChange={handleEditAdminInputChange}
    />
    <TextField
      name="Username"
      label="Username"
      value={(editAdminData as UserData).Username || ''}
      error={!!usernameError} // Highlight the field if there's an error
      helperText={usernameError} // Display error message
      onChange={handleEditAdminInputChange}
    />
    <TextField
      name="Email"
      label="Email"
      value={(editAdminData as UserData).Email || ''}
      error={!!emailError} // Highlight the field if there's an error
      helperText={emailError} // Display error message
      onChange={handleEditAdminInputChange}
    />
    <FormControl sx={{ width: "222px" }}>
      <InputLabel color="primary">Sex</InputLabel>
      <Select
        color="primary"
        name="Sex"
        label="Sex"
        displayEmpty
        value={(editAdminData as UserData).Sex || ''}
        defaultValue="Male"
        onChange={handleEditAdminMenuChange}
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </Select>
      <FormHelperText />
    </FormControl>
    <TextField
      name="Password"
      label="Password"
      value={(editAdminData as UserData).Password || ''}
      onChange={handleEditAdminInputChange}
      error={!!passwordError} // Highlight the field if there's an error
      helperText={passwordError} // Display error message
      type={showPassword ?  "password": "text"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleShowPasswordClick}
                    aria-label="toggle password visibility"
                  >
                    <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleEditAdminSubmit} color="primary">Save</Button>
    <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
  </DialogActions>
</Dialog>
        </form>   
      );
    };

    export default Admin;

