import { FunctionComponent, useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import styles from "./Sales.module.css";
import axios from "axios";
// Import icons as needed
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SideNavigation from "../Admincomponents/Sidenav"; 
import Header from "../Admincomponents/Header";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { saveAs } from 'file-saver'; // Import file-saver for saving the PDF file

interface Sale {
  Sale_ID: number;
  Product_ID: number;
  Category_ID: number;
  Quantity: number;
  Price: number;
  Sale_Date: string | number;
  Reference_Number: string;
}

const Sales: FunctionComponent = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/sales");
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(sales.length / itemsPerPage);

  const currentSales = sales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total quantity
  const totalQuantity = sales.reduce((total, sale) => total + sale.Quantity, 0);

  // Calculate total price
  const totalPrice = sales.reduce((total, sale) => total + sale.Price, 0);

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get('http://localhost:3001/generate-sales-report', {
        responseType: 'blob', // Set the response type to blob
      });
      const blob = new Blob([response.data], { type: 'application/pdf' }); // Create a blob object from the response data
      saveAs(blob, 'sales-report.pdf'); // Trigger a file download using file-saver
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };
  return (
    <div className={styles.sales}>
      <SideNavigation activeLink="sales" isOpen={false} />
      <Header />
      <div className={styles.salesChild} />
      <div className={styles.salesItem} />
      <div className={styles.salesInner}>
        <div className={styles.totalQuantity}>Total Quantity:</div>
        <div className={styles.total}>{totalQuantity}</div>
      </div>
      <div className={styles.rectangleDiv}>
        <div className={styles.totalPrice}>Total Price:</div>
        <div className={styles.total}>{totalPrice}</div>
      </div>
      <div className={styles.transactiontable}>
        <div className={styles.transaction}>
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
            className={styles.generatePdf}
            disableElevation={true}
            onClick={handleGenerateReport}
            variant="outlined"
          >
            Generate Report
          </Button>
          </div>
          {sales.length > 0 ? (
            <TableContainer style={{ maxHeight: 680, width: '100%' }}>
              <Table aria-label="Sales table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sales ID</TableCell>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Category ID</TableCell>
                    <TableCell>Total Quantity</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Sale Date</TableCell>
                    <TableCell>Reference Number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentSales.map(sale => (
                    <TableRow key={sale.Sale_ID}>
                      <TableCell>{sale.Sale_ID}</TableCell>
                      <TableCell>{sale.Product_ID}</TableCell>
                      <TableCell>{sale.Category_ID}</TableCell>
                      <TableCell>{sale.Quantity}</TableCell>
                      <TableCell>{sale.Price}</TableCell>
                      <TableCell>{sale.Sale_Date}</TableCell>
                      <TableCell>{sale.Reference_Number}</TableCell>
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
    </div>
  );
};

export default Sales;
