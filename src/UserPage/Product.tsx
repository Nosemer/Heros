import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState } from "react";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./Product.module.css";
import axios from "axios";
// Import icons as needed
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SideNavigation from "../Usercomponents/Sidenav";
import Header from "../Usercomponents/Header";
import { confirmAlert } from "react-confirm-alert";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OTPAuthenticationDialog from '../components/OTPAuthenticationDialog'; 
import { useAuth } from '../components/AuthContext';

interface ProductData {
  Product_ID: number;
  Product_Name: string;
  Price: number;
  Category_ID : string;
  Stock: number;
}
const initialProduct: ProductData = {
  Product_ID: 0,
  Product_Name: '',
  Price: 0,
  Category_ID: '',
  Stock: 0
}

  const Product: FunctionComponent = () => {

  const [ProductData, setProductData] = useState<ProductData>({
      Product_ID: 0,
      Product_Name: "",
      Price: 0,
      Category_ID: '',
      Stock: 0
    });
    const [Product, setProduct] = useState<ProductData[]>([]);
    const [categories, setCategories] = useState<ProductData[]>([]);
    const [productIds, setProductIds] = useState<string[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [SearchResults, setSearchResults] = useState<string | null>(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openAddStockDialog, setOpenAddStockDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<ProductData | null>(null);
    const [editProductData, setEditProductData] =  useState<ProductData | null>(initialProduct);
    const [selectedProduct, setSelectedProduct] = useState<number[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [isOTPDialogOpen, setOTPDialogOpen] = useState(false); // State to manage OTP dialog visibility
    const [otpVerificationSuccess, setOTPVerificationSuccess] = useState(false); // State to manage OTP verification success
    const [productName, setProductName] = useState<string>('');
    const [operation, setOperation] = useState<string>(''); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stock, setStock] = useState<number>(0);

    const { user } = useAuth();

      useEffect(() => {
      fetchProductData();
      fetchCategoryData();
    }, []);

      const fetchProductData = async () => {
        try {
          const productResponse = await axios.get("http://localhost:3001/product");
          setProduct(productResponse.data);
        } catch (error) {
          console.error("Error fetching Product:", error);
        }
      };
      const fetchCategoryData = async () => {
        try {
          const categoryResponse = await axios.get("http://localhost:3001/categoryId");
          setCategories(categoryResponse.data);
        } catch (error) {
          console.error("Error fetching Categories:", error);
        }
      };

      const fetchProducts = async (categoryId: string) => {
        try {
          const productResponse = await axios.get(`http://localhost:3001/api/select/product/${categoryId}`);
          console.log("Products fetched:", productResponse.data);
          setProducts(productResponse.data);
        } catch (error) {
          console.error("Error fetching Products:", error);
        }
      };
    
      const handleCategoryChange = (event: SelectChangeEvent<string>): void => {
        const selectedCategoryId = event.target.value;
        setSelectedCategory(selectedCategoryId);
        fetchProducts(selectedCategoryId);
      };
    
      const handleProductChange = (event: SelectChangeEvent<string>): void => {
        const selectedProductId = event.target.value;
        setSelectedProductId(selectedProductId);
      };
    
      const handleStockChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setStock(parseInt(event.target.value, 10));
      };
    
      const handleAddStock = async () => {
        try {
          await axios.post('http://localhost:3001/api/add-stock', {
            productId: selectedProduct,
            stock: stock,
          });
          alert('Stock added successfully');
          setOpenAddStockDialog(false); // Close the dialog after successful addition
        } catch (error) {
          console.error("Error adding stock:", error);
          alert('Failed to add stock');
        }
      };

  const handleOpenAddStockDialog = () => {
    setOpenAddStockDialog(true);
  };

  const handleCloseAddStockDialog = () => {
    setOpenAddStockDialog(false);
  };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProductData({ ...ProductData, [name]: value });
    };
    const handleAddNewProduct = async (event: { preventDefault: () => void; }) => {
      event.preventDefault(); 
      try {
        const response = await axios.post('http://localhost:3001/product/add', {
          Product_Name: ProductData.Product_Name,
          Price: ProductData.Price,
          Category_ID: selectedCategory, // Ensure that selectedCategory is the ID of the category
          Stock: ProductData.Stock
        });
    
        // Check if the product already exists based on the response
        const { exists } = response.data;
        if (exists) {
          setError("Product already exists");
          window.alert("Product already exists");
          setProductData(initialProduct);
        } else {
          console.log(response.data);
          window.alert("Product added successfully");
          fetchProductData();
          setProductData(initialProduct);
          setOpenAddDialog(false);
        }
      } catch (error) {
        console.error('Error adding product:', error);
        setError("Error adding product");
      }
    };
 
    const handleDelete = async (productName: string) => {
      try {
        const response = await axios.delete(`http://localhost:3001/product/delete/${productName}`);
        console.log(response.data);
        window.alert('Product deleted successfully');
        fetchProductData(); // Fetch updated products after successful deletion
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Error deleting product');
      }
    };
    const handleEditProduct = (productName: string) => {
      const productToEdit = Product.find(pro => pro.Product_Name === productName);
      if (productToEdit) {
        setEditProduct(productToEdit);
        setEditProductData(productToEdit);
      }
    };
    const handleEditProductInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditProductData(prevData => (prevData ? { ...prevData, [name]: value } : prevData));
    };

    const handleEditProductSubmit = async (event: { preventDefault: () => void; }) => {
      event.preventDefault(); 
      if (editProductData) {
        try {
          const response = await axios.put(`http://localhost:3001/product/edit/${editProductData.Product_ID}`, {
            Product_Name: editProductData.Product_Name,
            Price: editProductData.Price,
            Category_ID: editProductData.Category_ID,
            Stock: editProductData.Stock
          });
  
      
            if (response.status === 200) {
              alert('Product updated successfully');
              fetchProductData();
              setEditProduct(null);
            } else {
              throw new Error('Failed to update product');
            }
        } catch (error) {
          console.error('Error updating product:', (error as Error).message);
          alert('Error updating product. Please try again.');
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
      const response = await axios.get(`http://localhost:3001/product/search?q=${query}`);
      setProduct(response.data.products); // Update state with search results
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };
  
  const handleClearSearch = async () => {
    setSearchQuery("");
    await fetchProductData(); // Fetch original product data after clearing search
  };
  
  const handleSearchIconClick = async () => {
    await performSearch(searchQuery);

  };
  const handleAddButtonClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setProductData(initialProduct);
  };
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = Product.map(pro => pro.Product_ID);
      setSelectedProduct(newSelecteds);
      return;
    }
    setSelectedProduct([]);
  };

  const handleCheckboxClick = (event: ChangeEvent<HTMLInputElement>, id: number)  => {
    const selectedIndex = selectedProduct.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedProduct, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedProduct.slice(1));
    } else if (selectedIndex === selectedProduct.length - 1) {
      newSelected = newSelected.concat(selectedProduct.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedProduct.slice(0, selectedIndex),
        selectedProduct.slice(selectedIndex + 1)
      );
    }

    setSelectedProduct(newSelected);
  };
  const handleDeleteBulk = async () => {
    try {
      // Map the selectedProduct array to an array of product names
      const productNames = selectedProduct.map(id => Product.find(product => product.Product_ID === id)?.Product_Name || '');
  
      const response = await axios.post('http://localhost:3001/product/delete/bulk', {
        productNames: productNames.filter(name => name !== '') // Remove any empty names
      });
      console.log(response.data);
      window.alert("Products deleted successfully");
      setSelectedProduct([]); // Clear selected products after deletion
      fetchProductData();
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete products');
    }
  };
  
  const handleDeleteWithOTP = async (productName: string) => {
    setProductName(productName);
    setOperation('delete');
    setOTPDialogOpen(true);
  };

  const handleEditWithOTP = async (productName: string) => {
    setProductName(productName);
    setOperation('edit');
    setOTPDialogOpen(true);
  };
  const handleDeleteBulkWithOTP = async () => {
    setOperation('bulkDelete');
    setOTPDialogOpen(true);
    setOTPDialogOpen(true);
  };
  
  const handleOTPSuccess = async () => {
    setOTPVerificationSuccess(true);
    setOTPDialogOpen(false);
  
    if (operation === 'delete') {
      await handleDelete(productName);
    } else if (operation === 'edit') {
      await handleEditProduct(productName);
    } else if (operation === 'bulkDelete') {
      await handleDeleteBulk();
    }
  
    setOTPVerificationSuccess(false);
    setOperation('');
  };
  
  const isSelected = (id: number) => selectedProduct.indexOf(id) !== -1;
  const currentItems = Product.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(Product.length / itemsPerPage);
  return (
    <div className={styles.product}>
        <SideNavigation activeLink="product" isOpen={false}/>
      <Header />
      <div className={styles.productChild} />
      <div className={styles.productItem} />
      <div className={styles.productInner}><div className={styles.searchContainer}>
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
      <div className={styles.producttable}>
      <div className={styles.tableTitle}>PRODUCT TABLE</div>
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
              className={styles.productButton}
              disableElevation={true}
              onClick={handleAddButtonClick}
              variant="outlined"
              startIcon={<AddIcon />}
            >
            Add New
            </Button>
            <Button
              className={styles.stockButton}
              disableElevation={true}
              onClick={handleOpenAddStockDialog}
              variant="outlined"
              startIcon={<AddIcon />}
            >
            Add Stock
            </Button>
            <Button
            className={styles.productDelete}
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteBulkWithOTP}
            disabled={selectedProduct.length === 0}
          >
        Delete
      </Button>
          </div>
          <TableContainer style={{ maxHeight: 790, width: '100%' }}>
  <Table aria-label="product table">
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={selectedProduct.length > 0 && selectedProduct.length < currentItems.length}
            checked={currentItems.length > 0 && selectedProduct.length === currentItems.length}
            onChange={handleSelectAllClick}
            inputProps={{ 'aria-label': 'select all products' }}
          />
        </TableCell>
        <TableCell>Product ID</TableCell>
        <TableCell>Product Name</TableCell>
        <TableCell>Price</TableCell>
        <TableCell>Category ID</TableCell>
        <TableCell>Stock</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Product.slice((currentPage - 1) * 10, currentPage * 10).map(product => {
        const isItemSelected = isSelected(product.Product_ID);
        return (
          <TableRow
            key={product.Product_Name}
            selected={isItemSelected}
            aria-checked={isItemSelected}
          >
            <TableCell padding="checkbox">
              <Checkbox
                checked={isItemSelected}
                onChange={event => handleCheckboxClick(event, product.Product_ID)}
                inputProps={{ 'aria-labelledby': `product-checkbox-${product.Product_ID}` }}
              />
            </TableCell>
            <TableCell>{product.Product_ID}</TableCell>
            <TableCell>{product.Product_Name}</TableCell>
            <TableCell>{product.Price}</TableCell>
            <TableCell>{product.Category_ID}</TableCell>
            <TableCell>{product.Stock}</TableCell>
            <TableCell>
              <Tooltip title="Delete" arrow placement="top">
                <IconButton onClick={() => handleDeleteWithOTP(product.Product_Name)}>
                  <DeleteIcon sx={{ color: 'black' }}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit" arrow placement="top">
                <IconButton onClick={() => handleEditWithOTP(product.Product_Name)}>
                  <EditIcon sx={{ color: 'grey' }}/>
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
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <form onSubmit={handleAddNewProduct}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <TextField
              className={`${styles.dialogTextField}`}
              color="primary"
              name="Product_Name"
              label="Product Name"
              variant="outlined"
              value={ProductData.Product_Name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              className={`${styles.dialogTextField}`}
              color="primary"
              name="Price"
              label="Price"
              type="number"
              variant="outlined"
              value={ProductData.Price}
              onChange={handleChange}
              fullWidth
            />
            <FormControl
              className={styles.dialogTextField}
              fullWidth
            >
              <InputLabel color="primary">Category ID</InputLabel>
              <Select
                color="primary"
                name="Category_ID"
                label="Category ID"
                displayEmpty
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.Category_ID}>
                  {category.Category_ID}
                </MenuItem>
                ))}
              </Select>
              <FormHelperText />
            </FormControl>
            <TextField
              className={`${styles.dialogTextField}`}
              color="primary"
              type="number"
              name="Stock"
              label="Stock"
              variant="outlined"
              value={ProductData.Stock}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <OTPAuthenticationDialog
  isOpen={isOTPDialogOpen}
  onClose={() => setOTPDialogOpen(false)}
  onSuccess={handleOTPSuccess}

/>
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)}>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
              {editProductData && (
                <form onSubmit={handleEditProductSubmit}>
                  <TextField
                    label="Product Name"
                    name="Product_Name"
                    value={editProductData.Product_Name}
                    onChange={handleEditProductInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Price"
                    name="Price"
                    type="number"
                    value={editProductData.Price}
                    onChange={handleEditProductInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={editProductData.Category_ID}
                      onChange={handleCategoryChange}
                    >
                      {categories.map((category, index) => (
                        <MenuItem key={index} value={category.Category_ID}>
                         {category.Category_ID}
                      </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Stock"
                    name="Stock"
                    type="number"
                    value={editProductData.Stock}
                    onChange={handleEditProductInputChange}
                    fullWidth
                    margin="dense"
                  />
                  {error && <FormHelperText error>{error}</FormHelperText>}
                  <DialogActions>
                    <Button onClick={() => setEditProduct(null)}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </form>
              )}
            </DialogContent>
          </Dialog>
          <Dialog open={openAddStockDialog} onClose={handleCloseAddStockDialog}>
        <DialogTitle>Add Stock</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.Product_ID} value={category.Product_ID}>
                  {category.Product_Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="product-select-label">Product</InputLabel>
            <Select
              labelId="product-select-label"
              value={selectedProductId || ''}
              onChange={handleProductChange}
            >
              {products.map((product) => (
                <MenuItem key={product.Product_ID} value={product.Product_ID}>
                  {product.Product_Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Stock"
            type="number"
            value={stock}
            onChange={handleStockChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddStockDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleOpenAddStockDialog} color="primary">
            Add Stock
          </Button>
        </DialogActions>
      </Dialog>
       </div>
  );
};

export default Product;


