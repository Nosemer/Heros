import { FunctionComponent, useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import styles from "./Dashboard.module.css";
import SideNavigation from "../Admincomponents/Sidenav";
import Header from "../Admincomponents/Header";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ProductData {
  Product_Name: string;
  Price: number;
  Category_Name: string;
  Stock: number;
}
interface FastSale {
  product_id: number;
  product_name: string;
  category_id: string; // Assuming Category_ID is a string
  stock: number;
  purchase_frequency: number;
}

interface Critical {
  Product_ID: number;
  Product_Name: string;
  Category_ID: string;
  Price: number;
  Stock: number;
}
interface Sale{
  Sale_ID: number;
  Product_ID: number;
  Category_ID: number;
  Quantity: number;
  Price: number;
  Sale_Date: string | number;
  Reference_Number: string;
}
const Dashboard: FunctionComponent = () => {
  const [monthlySales, setMonthlySales] = useState<number>(0);
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [critical, setCritical] = useState<Critical[]>([]); 
  const [fastSale, setFastSale] = useState<FastSale[]>([]); 

  useEffect(() => {
    const fetchTotalStock = async () => {
      try {
        const response = await axios.get<ProductData[]>("http://localhost:3001/product");
        setTotalStock(response.data.reduce((acc, product) => acc + product.Stock, 0)); // Assuming each product has a stock property
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get<Sale[]>("http://localhost:3001/api/sales");
        const sales = response.data;
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1 to get the current month
        const currentYear = currentDate.getFullYear(); // Get the current year
        const monthlySales = sales
          .filter(sale => {
            const saleDate = new Date(sale.Sale_Date);
            return saleDate.getMonth() + 1 === currentMonth && saleDate.getFullYear() === currentYear;
          })
          .reduce((total, sale) => total + sale.Price, 0);
        setMonthlySales(monthlySales);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    

    const fetchCritical = async () => {
      try {
        const response = await axios.get<Critical[]>("http://localhost:3001/api/products/critical");
        setCritical(response.data); // Assuming the API returns the latest sale as the first element
      } catch (error) {
        console.error("Error fetching latest sale data:", error);
      }
    };

    const fetchFastSale = async () => {
      try {
        const response = await axios.get<FastSale[]>("http://localhost:3001/api/sales/frequent-products");
        setFastSale(response.data); // Set fastSale to the array of fetched data
      } catch (error) {
        console.error("Error fetching fastest sale data:", error);
      }
    };
    fetchTotalStock();
    fetchMonthlySales();
    fetchCritical();
    fetchFastSale();
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(Dashboard.length / itemsPerPage);
  return (
    <div className={styles.dashboard}>
      <SideNavigation activeLink="dashboard" isOpen={false} />
      <Header />
      <div className={styles.dashboardChild} />
      <div className={styles.dashboardItem} />
      <div className={styles.dashboardChild1}>
        <div className={styles.SaleTitle}>MONTHLY SALE:</div>
        <div className={styles.data}>{monthlySales}</div>
      </div>
      <div className={styles.dashboardChild2}>
        <div className={styles.StockTitle}>TOTAL STOCK:</div>
        <div className={styles.data}>{totalStock}</div>
      </div>
      <div className={styles.fastsale}>
        <div className={styles.saleTitle}>FASTEST SALE:</div>
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
          {fastSale && Array.isArray(fastSale) ? (
  <TableContainer style={{ maxHeight: 650, width: '100%' }}>
    <Table aria-label="fastest sale table">
      <TableHead>
        <TableRow>
          <TableCell>Product ID</TableCell>
          <TableCell>Product Name</TableCell>
          <TableCell>Category ID</TableCell>
          <TableCell>Stock</TableCell>
          <TableCell>Purchase Frequency</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {fastSale.map((sale, index) => (
          <TableRow key={index}>
            <TableCell>{sale.product_id}</TableCell>
            <TableCell>{sale.product_name}</TableCell>
            <TableCell>{sale.category_id}</TableCell>
            <TableCell>{sale.stock}</TableCell>
            <TableCell>{sale.purchase_frequency}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
) : (
  <div className={styles.loading}>LOADING...</div>
)}

      </div>
      <div className={styles.latestSale}>
        <div className={styles.saleTitle}>CRITICAL PRODUCT:</div>
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
        {critical && Array.isArray(critical) ? (
         <TableContainer style={{ maxHeight: 650, width: '100%' }}>
         <Table aria-label="fastest sale table">
           <TableHead>
             <TableRow>
               <TableCell>Product ID</TableCell>
               <TableCell>Product Name</TableCell>
               <TableCell>Category ID</TableCell>
               <TableCell>Stock</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {critical.map((sale, index) => (
               <TableRow key={index}>
                 <TableCell>{sale.Product_ID}</TableCell>
                 <TableCell>{sale.Product_Name}</TableCell>
                 <TableCell>{sale.Category_ID}</TableCell>
                 <TableCell>{sale.Stock}</TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>
        ) : (
          <div className={styles.loading}>LOADING...</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
