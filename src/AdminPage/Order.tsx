import { FunctionComponent, useState, useEffect } from "react";
import { Button, Select, MenuItem, TextField } from "@mui/material";
import styles from "./Order.module.css";
import SideNavigation from "../Admincomponents/Sidenav";
import Header from "../Admincomponents/Header";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import { SelectChangeEvent } from "@mui/material/Select";

interface Product {
  Product_ID: string;
  Product_Name: string;
}

interface Category {
  Category_ID: string;
  Category_Name: string;
}

interface CartItem {
  Product_ID: string;
  Product_Name: string;
  Category_ID: string;
  Price: number;
  Quantity: number;
}

const Order: FunctionComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedProductPrice, setSelectedProductPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<number>(0);


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoryResponse = await axios.get("http://localhost:3001/api/select/category");
      console.log("Categories fetched:", categoryResponse.data);
      setCategories(categoryResponse.data);
    } catch (error) {
      console.error("Error fetching Categories:", error);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>): void => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
    const [categoryId] = selectedCategory.split('/'); // Extract the Category_ID
    fetchProducts(categoryId);
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

  const handleProductChange = (event: SelectChangeEvent<string>): void => {
    const selectedProductId = event.target.value;
    const [productId] = selectedProductId.split('/');
    setSelectedProduct(selectedProductId);
    fetchProductPrice(productId);
  };

  const fetchProductPrice = async (productId: string) => {
    try {
      const productPriceResponse = await axios.get(`http://localhost:3001/api/select/productPrice/${productId}`);
      const productPrice = parseFloat(productPriceResponse.data.Price); // Ensure price is a number
      console.log("Product price fetched:", productPrice);
      setSelectedProductPrice(productPrice);
    } catch (error) {
      console.error("Error fetching Product Price:", error);
    }
  };

  const handleAddToCart = () => {
    const productDetails = selectedProduct.split('/');
    const categoryId = productDetails[0];
    const productId = productDetails[0];
    const productName = productDetails[1];
    const newCartItem: CartItem = {
      Product_ID: productId,
      Category_ID: categoryId,
      Product_Name: productName,
      Price: selectedProductPrice,
      Quantity: quantity,
    };
    setCartItems([...cartItems, newCartItem]);
    handleClearCart();
  };
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.Price * item.Quantity;
    });
    return totalPrice.toFixed(2); // Convert to string with 2 decimal places
  };
  const total: number = parseInt(calculateTotalPrice());
  const change: number = payment - total;
  
  const handleClear = () => {
    // Clear cart items and payment
    setCartItems([]);
    setPayment(0);
  };
  const handleClearCart = () => {
  setSelectedCategory('');
  setSelectedProduct('');
  setSelectedProductPrice(0); 
  setQuantity(0);
  };
  const deductStocks = async (productId: string[], quantity: number[]) => {
    try {
      const response = await axios.post("http://localhost:3001/api/deduct-stocks", { productId, quantity });
      console.log('Stocks deducted successfully:', response.data);
    } catch (error) {
      throw new Error("Failed to deduct stocks");
    }
  };
  const handleBuy = async () => {
    try {
      await deductStocks(
        cartItems.map(item => item.Product_ID),
        cartItems.map(item => item.Quantity)
      );

      // Generate a reference number (you can customize this as needed)
      const referenceNumber = Math.random().toString(36).substring(7);

      // Prepare the data for the request
      const saleData = {
        Product_ID: cartItems.map(item => item.Product_ID),
        Category_ID: cartItems.map(item => item.Category_ID),
        Quantity: cartItems.map(item => item.Quantity),
        Sale_Date: new Date().toISOString(),
        Price: cartItems.map(item => item.Price * item.Quantity),
        Reference_Number: referenceNumber,
      };

      // Make the POST request to insert sales
      const response = await axios.post('http://localhost:3001/api/insert-sale', saleData);
      console.log('Sales inserted successfully:', response.data);

      // Ask if the user wants a receipt
      confirmAlert({
        title: 'Receipt',
        message: 'Do you want to generate a receipt?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              try {
                const receiptResponse = await axios.post('http://localhost:3001/api/generate-receipt', {
                  cartItems,
                  payment,
                  change,
                  total
                }, { responseType: 'blob' });

                const url = window.URL.createObjectURL(new Blob([receiptResponse.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'receipt.pdf');
                document.body.appendChild(link);
                link.click();
                handleClear();
              } catch (error) {
                console.error('Error generating receipt:', error);
              }
            }
          },
          {
            label: 'No',
            onClick: () => handleClear()
          }
        ]
      });

    } catch (error) {
      console.error('Error finalizing transaction:', error);
      // Handle error as needed
    }
  };

  
  return (
    <div className={styles.order}>
      <SideNavigation activeLink="order" isOpen={false}/>
      <Header />
      <div className={styles.orderChild} />
      <div className={styles.orderItem} />
      <div className={styles.rectangleDiv} />
      <div className={styles.rectangleDiv2}>
        <div className={styles.pos}>
        <div className={styles.orderTitle}>ORDER</div>
          <Select
            className={styles.CategoryId}
            value={selectedCategory}
            onChange={handleCategoryChange}
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Category ID
            </MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={`${category.Category_ID}/${category.Category_Name}`}>
                {`${category.Category_ID}/${category.Category_Name}`}
              </MenuItem>
            ))}
          </Select>
          <Select
            className={styles.ProductId}
            value={selectedProduct}
            onChange={handleProductChange}
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Product ID
            </MenuItem>
            {products.map((product, index) => (
              <MenuItem key={index} value={`${product.Product_ID}/${product.Product_Name}`}>
                {`${product.Product_ID}/${product.Product_Name}`}
              </MenuItem>
            ))}
          </Select>
          <TextField
            className={styles.Price}
            label="Price"
            type="number"
            value={selectedProductPrice.toString()}
            variant="outlined"
            disabled
          />
          <TextField
            className={styles.Quantity}
            label="Quantity"
            type="number"
            value={quantity}
            required={true}
            onChange={(e) => setQuantity(Number(e.target.value))}
            variant="outlined"
          />
          <Button
            className={styles.addToCartButton}
            variant="outlined"
            onClick={handleAddToCart}
            disabled={!selectedCategory || !selectedProduct || quantity <= 0} // Disable if any field is not filled
          >
            Add to Cart
          </Button>
        </div>
      </div>
      <div className={styles.orderInner}>
        <h3>Cart Items</h3>
        <ul className={styles.cartItems}>
          {cartItems.map((item, index) => (
            <li key={index} className={styles.cartItem}>
              <h4>Product ID: {item.Product_ID}</h4>
              <p>Product Name: {item.Product_Name}</p>
              <p>Price: {item.Price}</p>
              <p>Quantity: {item.Quantity}</p>
            </li>
          ))}
        </ul>
        <div className={styles.transactionTable}>
          <div className={styles.TransactionTitle}>
            <h5>Total Price:</h5>
            <h5>Payment:</h5>
            <h5>Change:</h5>
          </div>
          <div className={styles.TransactionPrice}>
            <h5>₱{total}</h5>
            <h5>₱{payment}</h5>
            <h5>₱{change}</h5>
          </div>
        </div>
        <div className={styles.paymentSection}>
          <TextField
            className={styles.paymentField}
            label="Payment"
            type="number"
            value={payment}
            onChange={(e) => setPayment(Number(e.target.value))}
            variant="outlined"
          />
          <Button
            className={styles.buyButton}
            variant="outlined"
            size="small"
            onClick={handleBuy}
            disabled={payment < total} // Disable the button if payment is less than total price
          >
            Buy
          </Button>
          <Button
            className={styles.cancelBuy}
            variant="outlined"
            size="small"
            onClick={handleClear}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Order;
