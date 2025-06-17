import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tooltip,
  Checkbox
 } from "@mui/material";
import styles from "./Category.module.css";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import SideNavigation from "../Admincomponents/Sidenav";
import Header from "../Admincomponents/Header";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OTPAuthenticationDialog from "../components/OTPAuthenticationDialog";

interface Category {
  Category_ID: number;
  Category_Name: string;
}

const initialCategory: Category = {
  Category_ID: 0,
  Category_Name: "",
}

const Category: FunctionComponent = () => {
  const [formData, setFormData] = useState<Category>(initialCategory);
  const [category, setCategory] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editCategoryData, setEditCategoryData] = useState<Category | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isOTPDialogOpen, setOTPDialogOpen] = useState(false); // State for OTP dialog
  const [OTPVerificationSuccess, setOTPVerificationSuccess] = useState(false);
  const [operation, setOperation] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/category");
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://localhost:3001/category/add', formData);

      const { exists } = response.data;
      if (exists) {
        setError("Category already exists");
        window.alert("Category already exists");
        setFormData(initialCategory); 
      } else {
        console.log(response.data);
        window.alert("Category added successfully");
        fetchData();
        setFormData(initialCategory);
        setOpenAddDialog(false);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setError("Error adding category");
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (categoryId: number) => {
            try {
              const response = await axios.delete(`http://localhost:3001/category/delete/${categoryId}`);
              console.log(response.data);
              window.alert("Category deleted successfully");
              fetchData();
            } catch (error) {
              console.error('Error deleting category:', error);
              setError("Error deleting category");
            }
  };

  const handleEditCategory = (categoryId: number) => {
    const categoryToEdit = category.find(cat => cat.Category_ID === categoryId);
    if (categoryToEdit) {
      setEditCategory(categoryToEdit);
      setEditCategoryData(categoryToEdit);
    }
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditCategoryData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleEditSubmit = async () => {
    if (editCategoryData) {
      try {
        const response = await axios.put(`http://localhost:3001/category/edit/${editCategory?.Category_ID}`, {
          Category_ID: editCategoryData.Category_ID,
          Category_Name: editCategoryData.Category_Name,
        });
        if (response.status === 200) {
          alert("Category updated successfully");
          fetchData();
          setEditCategory(null);
        } else {
          throw new Error("Failed to update category");
        }
      } catch (error) {
        console.error("Error updating category:", error);
        alert("Error updating category. Please try again.");
      }
    }
  };
  const handleSearchInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    await performSearch(newQuery);
  };
  const performSearch = async (query: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/category/search?q=${query}`);
      setCategory(response.data.categories); // Ensure that response.data.categories is the correct path to your search results
    } catch (error) {
      console.error("Error searching categories:", error);
    }
  };
  const handleClearSearch = async () => {
    setSearchQuery("");
    await fetchData();
  };
  const handleSearchIconClick = async () => {
    await performSearch(searchQuery);

  };

  const handleAddButtonClick = () => {
    setOpenAddDialog(true); // Open dialog when "Add" button is clicked
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false); // Close dialog
    setFormData(initialCategory); // Reset form data to initial values
  };  

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = category.map(cat => cat.Category_ID);
      setSelectedCategories(newSelecteds);
      return;
    }
    setSelectedCategories([]);
  };

  const handleCheckboxClick = (event: ChangeEvent<HTMLInputElement>, id: number)  => {
    const selectedIndex = selectedCategories.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCategories, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCategories.slice(1));
    } else if (selectedIndex === selectedCategories.length - 1) {
      newSelected = newSelected.concat(selectedCategories.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCategories.slice(0, selectedIndex),
        selectedCategories.slice(selectedIndex + 1)
      );
    }

    setSelectedCategories(newSelected);
  };

  const handleDeleteBulk = async () => {
   
            try {
              const response = await axios.post('http://localhost:3001/category/delete/bulk', {
                categoryIDs: selectedCategories
              });
              console.log(response.data);
              window.alert("Categories deleted successfully");
              setSelectedCategories([]); // Clear selected categories after deletion
              fetchData();
            } catch (error) {
              console.error('Error deleting categories:', error);
              setError("Error deleting categories");
            }
  };

  const handleDeleteWithOTP = async (categoryId: number) => {
    setCategoryId(categoryId);
    setOperation('delete');
    setOTPDialogOpen(true);
  };

  const handleEditWithOTP = async (categoryId: number) => {
    setCategoryId(categoryId);
    setOperation('edit');
    setOTPDialogOpen(true);
  };
  const handleDeleteBulkWithOTP = async () => {
    setCategoryId(categoryId);
    setOperation('bulkDelete');
    setOTPDialogOpen(true);
  };
  
  const handleOTPSuccess = async () => {
    setOTPVerificationSuccess(true);
    setOTPDialogOpen(false);

    if (operation === 'delete' && categoryId !== null) {
      await handleDelete(categoryId);
    } else if (operation === 'edit' && categoryId !== null) {
      handleEditCategory(categoryId); // Open the edit dialog with the selected category
    } else if (operation === 'bulkDelete') {
      await handleDeleteBulk();
    }

    setOTPVerificationSuccess(false);
    setOperation('');
    setCategoryId(null);
  };
  
  const isSelected = (id: number) => selectedCategories.indexOf(id) !== -1;
  const currentItems = category.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(category.length / itemsPerPage);

  return (
    <div className={styles.category}>
      <SideNavigation activeLink="category" isOpen={false} />
      <div className={styles.categoryChild} />
      <Header />
      <div className={styles.categoryItem} />
      <div className={styles.categoryInner}>
        <div className={styles.searchContainer}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon onClick={handleSearchIconClick} style={{ cursor: 'pointer' }} />
                </InputAdornment>
              ),
              endAdornment: (
                searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              )
            }}
            sx={{
              height: 48,
              marginBottom: 2,
              width: '100%',
              maxWidth: 800,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ccc',
                },
                '&:hover fieldset': {
                  borderColor: '#aaa',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#000',
                },
                '& input': {
                  height: 'auto',
                  padding: '12px 14px',
                },
              },
            }}
          />
        </div>
      </div>
      <div className={styles.categorytable}>
        <div className={styles.tableTitle}>CATEGORY TABLE</div>
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
          <Button
            className={styles.categoryButton}
            disableElevation={true}
            onClick={handleAddButtonClick}
            variant="outlined"
            startIcon={<AddIcon />}
          >
            Add
          </Button>
          <Button
            className={styles.categoryDelete}
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteBulkWithOTP}
            disabled={selectedCategories.length === 0}
          >
        Delete
      </Button>
        </div>
        <TableContainer style={{ maxHeight: 680, width: '100%' }}>
          <Table aria-label="category table">
            <TableHead>
              <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedCategories.length > 0 && selectedCategories.length < currentItems.length}
                  checked={currentItems.length > 0 && selectedCategories.length === currentItems.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all categories' }}
                />
              </TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {currentItems.map((category) => {
              const isItemSelected = isSelected(category.Category_ID);
              return (
                <TableRow
                  key={category.Category_ID}
                  selected={isItemSelected}
                  aria-checked={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onChange={(event) => handleCheckboxClick(event, category.Category_ID)}
                      inputProps={{ 'aria-labelledby': category.Category_ID.toString() }}
                    />
                  </TableCell>
                  <TableCell>{category.Category_ID}</TableCell>
                  <TableCell>{category.Category_Name}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete" arrow placement="top">
                      <IconButton onClick={() => handleDeleteWithOTP(category.Category_ID)}>
                        <DeleteIcon sx={{ color: 'black' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" arrow placement="top">
                      <IconButton onClick={() => handleEditWithOTP(category.Category_ID)}>
                        <EditIcon sx={{ color: 'grey' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          </Table>
        </TableContainer>
      </div>
      <OTPAuthenticationDialog
  isOpen={isOTPDialogOpen}
  onClose={() => setOTPDialogOpen(false)}
  onSuccess={handleOTPSuccess}

/>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          {/* Form fields for adding a new category */}
          <TextField
            label="Category ID"
            name="Category_ID"
            variant="outlined"
            type="number"
            value={formData.Category_ID}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Category Name"
            name="Category_Name"
            variant="outlined"
            value={formData.Category_Name}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editCategory !== null} onClose={() => setEditCategory(null)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          {/* Form fields for editing */}
          <TextField
            name="Category_ID"
            label="Category ID"
            value={(editCategoryData as Category).Category_ID || ''}
            onChange={handleEditInputChange}
            fullWidth
          />
          <TextField
            name="Category_Name"
            label="New Category Name"
            value={(editCategoryData as Category).Category_Name || ''}
            onChange={handleEditInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSubmit} color="primary">Save</Button>
          <Button onClick={() => setEditCategory(null)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Category;
