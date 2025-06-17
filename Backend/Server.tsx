const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventory'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


// Function to generate receipt PDF
const generateReceipt = (cartItems, payment, change, total, referenceNumber) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Receipt', 20, 20);
  doc.setFontSize(12);
  doc.text(`Reference Number: ${referenceNumber}`, 20, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

  const tableData = cartItems.map(item => ([
    item.Product_ID,
    item.Product_Name,
    item.Price,
    item.Quantity,
    (item.Price * item.Quantity).toFixed(2)
  ]));

  doc.autoTable({
    head: [['Product ID', 'Product Name', 'Price', 'Quantity', 'Total']],
    body: tableData,
    startY: 50,
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total: ₱${total}`, 20, finalY);
  doc.text(`Payment: ₱${payment}`, 20, finalY + 10);
  doc.text(`Change: ₱${change}`, 20, finalY + 20);

  return doc;
};

// Endpoint to generate receipt
app.post('/api/generate-receipt', async (req, res) => {
  const { cartItems, payment, change, total } = req.body;

  const referenceNumber = Math.random().toString(36).substring(7);
  const doc = generateReceipt(cartItems, payment, change, total, referenceNumber);

  const filePath = path.join(__dirname, 'receipt.pdf');
  doc.save(filePath);

  // Send the PDF to the client
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).send({ message: 'Failed to generate receipt' });
    } else {
      // Delete the file after sending it
      fs.unlinkSync(filePath);
    }
  });
});
// Route to generate PDF report
app.get('/generate-sales-report', (req, res) => {
  console.log('Received request for sales report');

  // Query to fetch sales data from the database
  const query = 'SELECT `Sale_ID`, `Product_ID`, `Category_ID`, `Quantity`, `Sale_Date`, `Price`, `Reference_Number` FROM `sales` WHERE 1';

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sales data:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.send('No report yet');
      return;
    }

    // Create a new PDF document
    const doc = new jsPDF();

    // Add a title
    doc.text('Sales Report', 105, 10, { align: 'center' });

    // Define the table columns
    const columns = [
      { header: 'Sale ID', dataKey: 'Sale_ID' },
      { header: 'Product ID', dataKey: 'Product_ID' },
      { header: 'Category ID', dataKey: 'Category_ID' },
      { header: 'Quantity', dataKey: 'Quantity' },
      { header: 'Sale Date', dataKey: 'Sale_Date' },
      { header: 'Price', dataKey: 'Price' },
      { header: 'Reference Number', dataKey: 'Reference_Number' }
    ];

    // Use autoTable to generate the table
    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: results.map(row => [
        row.Sale_ID, 
        row.Product_ID, 
        row.Category_ID, 
        row.Quantity, 
        row.Sale_Date, 
        row.Price, 
        row.Reference_Number
      ]),
      startY: 20
    });

    // Output the PDF as a binary string
    const pdfString = doc.output('datauristring');

    // Convert the data URI to a buffer
    const data = pdfString.split(',')[1];
    const buffer = Buffer.from(data, 'base64');

    // Send the PDF buffer as the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');
    res.send(buffer);
  });
});

// In-memory store for OTPs
const otpStore = {};

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { username } = req.body;

  const query = 'SELECT Email FROM admin WHERE Username = ?';
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      return res.status(500).send('Internal server error');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const email = results[0].Email;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Store the OTP in the in-memory store
    otpStore[username] = otp;
//spio mjuv rkpw bzui
    // Send the OTP via email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'gonzalesemerson079@gmail.com',
        pass: 'spio mjuv rkpw bzui'
      },
      tls: {
        rejectUnauthorized: false // Ignore SSL certificate validation
      }
    });

    const mailOptions = {
      from: 'eraldgolas@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).send('Error sending OTP');
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).send('OTP sent successfully');
      }
    });
  });
});
// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  const { username, otp } = req.body;

  // Verify the OTP
  if (otpStore[username] && otpStore[username] === otp) {
    // OTP is correct
    delete otpStore[username]; // Remove OTP after verification
    res.json({ success: true });
  } else {
    // OTP is incorrect
    res.json({ success: false });
  }
});
  // Fetch users from MySQL
  app.get('/api', (req, res) => { 
    const query = 'SELECT * FROM users'; 
    connection.query(query, (error, results) => { 
      if (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).send('Internal server error');
        return;
      }
      res.json(results); 
    }); 
  }); 
  app.get('/api/admin', (req, res) => { 
    const query = 'SELECT * FROM admin'; 
    connection.query(query, (error, results) => { 
      if (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).send('Internal server error');
        return;
      }
      res.json(results); 
    }); 
  }); 
  app.get('/api/loggedInUser', (req, res) => { 
    const query = 'SELECT `First_Name`, `Position` FROM `users`'; // SQL query to select First_Name and Position
    connection.query(query, (error, results) => { 
      if (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).send('Internal server error');
        return;
      }
      res.json(results); // Return the results as JSON
    }); 
});
  // Handle login in the user
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    // First check if the email exists
    const emailQuery = 'SELECT * FROM users WHERE Username = ?';
    connection.query(emailQuery, [username], (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        // username not found
        res.json({ success: false, error: 'Invalid Username' });
      } else {
        // username exists, now check the password
        const passwordQuery = 'SELECT * FROM users WHERE Username = ? AND Password = ?';
        connection.query(passwordQuery, [username, password], (error, results) => {
          if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
          }
  
          if (results.length === 1) {
            // User found, generate a JWT token
            const user = results[0];
            const token = jwt.sign({ userId: user.ID, username: user.Username }, 'secretKey', { expiresIn: '24h' }); // Modify 'secretKey' with your secret key
            res.json({ success: true, message: 'Login successful', token });
          } else {
            // Password incorrect
            res.json({ success: false, error: 'Invalid password' });
          }
        });
      }
    });
  });
  // Admin login endpoint
  app.post('/api/login/admin', (req, res) => {
    const { username, password } = req.body;
  
    // First check if the email exists
    const emailQuery = 'SELECT * FROM admin WHERE Username = ?';
    connection.query(emailQuery, [username], (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        // Email not found
        res.json({ success: false, error: 'Invalid Username' });
      } else {
        // Email exists, now check the password
        const passwordQuery = 'SELECT * FROM admin WHERE Username = ? AND Password = ?';
        connection.query(passwordQuery, [username, password], (error, results) => {
          if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
          }
  
          if (results.length === 1) {
            // Admin found, generate a JWT token
            const admin = results[0];
            const token = jwt.sign({ userId: admin.ID, username: admin.username }, 'secretKey', { expiresIn: '24h' }); // Modify 'secretKey' with your secret key
            res.json({ success: true, message: 'Login successful', token });
          } else {
            // Password incorrect
            res.json({ success: false, error: 'Invalid password' });
          }
        });
      }
    });
  });
   // Check if email exists
app.post('/api/username', (req, res) => {
    const { username } = req.body;
  
    // Query the database to check if the email exists
    const query = 'SELECT * FROM users WHERE Username = ?';
    connection.query(query, [username], (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ exists: false, error: 'Internal server error' });
        return;
      }
  
      if (results.length > 0) {
        // Email exists
        res.json({ exists: true });
      } else {
        // Email does not exist
        res.json({ exists: false });
      }
    });
  });
  // Check if password exists
app.post('/api/Password', (req, res) => {
  const { pass } = req.body;

  // Query the database to check if the password exists
  const query = 'SELECT * FROM users WHERE Password = ?';
  connection.query(query, [pass], (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ exists: false, error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      // Password exists
      res.json({ exists: true });
    } else {
      // Password does not exist
      res.json({ exists: false });
    }
  });
});
// Check if Email  exists
app.post('/api/Email', (req, res) => {
  const { email } = req.body;

  // Query the database to check if the password exists
  const query = 'SELECT * FROM users WHERE Email = ?';
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ exists: false, error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      // Email exists
      res.json({ exists: true });
    } else {
      // Email does not exist
      res.json({ exists: false });
    }
  });
});
app.get('/users/:password/contact', (req, res) => {
  const { password } = req.params;

  const query = 'SELECT `Contact_Number` FROM `users` WHERE `Password` = ?';
  connection.query(query, [password], (error, results) => {
    if (error) {
      console.error('Error fetching contact number:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      const contactNumber = results[0].Contact_Number;
      res.json({ contactNumber });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});
app.post('/api/admin/username', (req, res) => {
  const { username } = req.body;

  // Query the database to check if the email exists
  const query = 'SELECT * FROM admin WHERE Username = ?';
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ exists: false, error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      // Email exists
      res.json({ exists: true });
    } else {
      // Email does not exist
      res.json({ exists: false });
    }
  });
});
// Check if password exists
app.post('/api/admin/Password', (req, res) => {
const { pass } = req.body;

// Query the database to check if the password exists
const query = 'SELECT * FROM admin WHERE Password = ?';
connection.query(query, [pass], (error, results) => {
  if (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ exists: false, error: 'Internal server error' });
    return;
  }

  if (results.length > 0) {
    // Password exists
    res.json({ exists: true });
  } else {
    // Password does not exist
    res.json({ exists: false });
  }
});
});
// Check if Email exists
app.post('/api/admin/Email', (req, res) => {
const { email } = req.body;

// Query the database to check if the password exists
const query = 'SELECT * FROM admin WHERE Email = ?';
connection.query(query, [email], (error, results) => {
  if (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ exists: false, error: 'Internal server error' });
    return;
  }

  if (results.length > 0) {
    // Email exists
    res.json({ exists: true });
  } else {
    // Email does not exist
    res.json({ exists: false });
  }
});
});
app.get('/admin/Email', (req, res) => {
  const { username, password } = req.query;

  const query = 'SELECT `Email` FROM `admin` WHERE `Username` = ? AND `Password` = ?';
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Error fetching admin contact number:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      const Email = results[0].Email;
      res.json({ Email });
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  });
});

// Insert userdata into MySQL
app.post('/api/insert/admin', (req, res) => {
  const { First_Name, Last_Name, Username, Password, Email, Sex } = req.body;

  // Query to get the maximum ID from the users table
  const maxIdQuery = 'SELECT MAX(ID) AS maxId FROM admin';
  connection.query(maxIdQuery, (maxIdError, maxIdResults) => {
    if (maxIdError) {
      console.error('Error getting maximum ID from database:', maxIdError);
      res.status(500).send('Internal server error');
      return;
    }

    const maxId = maxIdResults[0].maxId || 0; // If there are no existing users, start with ID 0

    // Insert registration data into the database with the next available ID
    const nextId = maxId + 1;
    const insertQuery = 'INSERT INTO admin (ID, First_Name, Last_Name, Username, Password, Email, Sex) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [nextId, First_Name, Last_Name, Username, Password, Email, Sex], (insertError, insertResult) => {
      if (insertError) {
        console.error('Error inserting data into admin table:', insertError);
        res.status(500).send('Failed to register admin');
        return;
      }
  
      console.log('New admin registered with ID:', insertResult.insertId);
      res.status(201).send('Admin registered successfully');
    });
  });
});
app.post('/api/insert/user', (req, res) => {
  const { First_Name, Last_Name, Username, Password, Email, Sex } = req.body;

  // Query to get the maximum ID from the users table
  const maxIdQuery = 'SELECT MAX(ID) AS maxId FROM users';
  connection.query(maxIdQuery, (maxIdError, maxIdResults) => {
    if (maxIdError) {
      console.error('Error getting maximum ID from database:', maxIdError);
      res.status(500).send('Internal server error');
      return;
    }

    const maxId = maxIdResults[0].maxId || 0; // If there are no existing users, start with ID 0

    // Insert registration data into the database with the next available ID
    const nextId = maxId + 1;
    const insertQuery = 'INSERT INTO users (ID, First_Name, Last_Name, Username, Password, Email, Sex) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [nextId, First_Name, Last_Name, Username, Password, Email, Sex], (insertError, insertResult) => {
      if (insertError) {
        console.error('Error inserting data into user table:', insertError);
        res.status(500).send('Failed to register user');
        return;
      }
  
      console.log('New admin registered with ID:', insertResult.insertId);
      res.status(201).send('Admin registered successfully');
    });
  });
});
// Delete Userdata into MySQL
app.delete('/api/deleteUser/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ success: false, message: 'Invalid user ID' });
      return;
    }
    // Query to delete user by ID
    const deleteQuery = 'DELETE FROM users WHERE ID = ?';
    connection.query(deleteQuery, [userId], (deleteError, deleteResults) => {
      if (deleteError) {
        console.error('Error deleting user from database:', deleteError);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      if (deleteResults.affectedRows === 0) {
        // No user found with the given ID
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        // Query to update IDs of users with higher ID
        const updateQuery = 'UPDATE users SET ID = ID - 1 WHERE ID > ?';
        connection.query(updateQuery, [userId], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating user IDs in database:', updateError);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
          }

          // User deleted successfully and IDs updated
          res.status(200).json({ success: true, message: 'User deleted successfully' });
        });
      }
    });
  });
// Update admin data in MySQL
app.delete('/api/deleteAdmin/:adminId', (req, res) => {
  const adminId = parseInt(req.params.adminId);
  if (isNaN(adminId)) {
    res.status(400).json({ success: false, message: 'Invalid admin ID' });
    return;
  }
  // Query to delete user by ID
  const deleteQuery = 'DELETE FROM admin WHERE ID = ?';
  connection.query(deleteQuery, [adminId], (deleteError, deleteResults) => {
    if (deleteError) {
      console.error('Error deleting admin from database:', deleteError);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (deleteResults.affectedRows === 0) {
      // No admin found with the given ID
      res.status(404).json({ success: false, message: 'admin not found' });
    } else {
      // Query to update IDs of admin with higher ID
      const updateQuery = 'UPDATE admin SET ID = ID - 1 WHERE ID > ?';
      connection.query(updateQuery, [adminId], (updateError, updateResults) => {
        if (updateError) {
          console.error('Error updating admin IDs in database:', updateError);
          res.status(500).json({ success: false, message: 'Internal server error' });
          return;
        }

        // User deleted successfully and IDs updated
        res.status(200).json({ success: true, message: 'Admin deleted successfully' });
      });
    }
  });
});
// Update user data in MySQL
app.put('/api/editUser/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { firstName, lastName, username, password, email, sex } = req.body;

  connection.query('UPDATE users SET First_Name = ?, Last_Name = ?, Username = ?, Password = ?, Email = ?, Sex = ? WHERE ID = ?',
    [firstName, lastName, username, password, email, sex, userId], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating user:', updateError);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      if (updateResults.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'User updated successfully' });
    });   
});
app.put('/api/editAdmin/:adminId', (req, res) => {
  const adminId = parseInt(req.params.adminId); // Corrected parameter name from userId to adminId
  const { firstName, lastName, username, password, email, sex } = req.body;

  connection.query('UPDATE admin SET First_Name = ?, Last_Name = ?, Username = ?, Password = ?, Email = ?, Sex = ? WHERE ID = ?',
    [firstName, lastName, username, password, email, sex, adminId], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating admin:', updateError);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }
      if (updateResults.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Admin not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Admin updated successfully' });
    });   
});
// this is where category table start
app.get('/api/Category', (req, res) => { 
  const query = 'SELECT * FROM category'; 
  connection.query(query, (error, results) => { 
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(results); 
  }); 
}); 
//add to category
// Add a new category
app.post('/category/add', (req, res) => {
  const { Category_Name, Category_ID } = req.body;

  const checkSql = 'SELECT * FROM category WHERE Category_ID = ?';
  connection.query(checkSql, [Category_ID], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // If the category ID already exists, return a response indicating it exists
    if (results.length > 0) {
      res.json({ exists: true });
      return;
    }

    // Values to insert into the query
    const sql = 'INSERT INTO category (Category_Name, Category_ID) VALUES (?, ?)';
    connection.query(sql, [Category_Name, Category_ID], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).send('Error executing SQL query');
      }
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
    });
  });
});
// Delete a category by Category_ID
app.delete('/category/delete/:categoryID', (req, res) => {
  const categoryID = req.params.categoryID;

  // Delete the category from the database
  const deleteSql = 'DELETE FROM category WHERE Category_ID = ?';
  connection.query(deleteSql, [categoryID], (err, result) => {
    if (err) {
      console.error('Error deleting category from database:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (result.affectedRows === 0) {
      // No category found with the given ID
      res.status(404).json({ success: false, message: 'Category not found' });
    } else {
      // Category deleted successfully
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    }
  });
});
app.post('/category/delete/bulk', (req, res) => {
  const categoryIDs = req.body.categoryIDs;

  // Ensure that categoryIDs is an array
  if (!Array.isArray(categoryIDs) || categoryIDs.length === 0) {
    res.status(400).json({ success: false, message: 'Invalid or empty category IDs array' });
    return;
  }

  // Delete categories from the database
  const deleteSql = 'DELETE FROM category WHERE Category_ID IN (?)';
  connection.query(deleteSql, [categoryIDs], (err, result) => {
    if (err) {
      console.error('Error deleting categories from database:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (result.affectedRows === 0) {
      // No categories found with the given IDs
      res.status(404).json({ success: false, message: 'No categories found with the given IDs' });
    } else {
      // Categories deleted successfully
      res.status(200).json({ success: true, message: 'Categories deleted successfully' });
    }
  });
});
app.put('/category/edit/:categoryID', (req, res) => {
  const categoryID = req.params.categoryID;
  const { Category_ID, Category_Name } = req.body;

  // Correct SQL query with WHERE clause
  connection.query(
    'UPDATE Category SET Category_ID = ?, Category_Name = ? WHERE Category_ID = ?',
    [Category_ID, Category_Name, categoryID],
    (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating Category:', updateError);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      if (updateResults.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Category updated successfully' });
    }
  );
});
//search from category
app.get('/category/search', (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query parameters

  // Check if the search term is provided
  if (!searchTerm) {
    return res.status(400).json({ success: false, message: 'Search term is required' });
  }

  // Query to search for categories based on the search term in Category_Name or Category_ID
  const query = 'SELECT * FROM category WHERE Category_Name LIKE ? OR Category_ID LIKE ?';
  const searchValue = `%${searchTerm}%`; // Add wildcard characters for partial matching
  connection.query(query, [searchValue, searchValue], (error, results) => {
    if (error) {
      console.error('Error searching categories:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    // Check if any categories were found
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No categories found' });
    } else {
      return res.status(200).json({ success: true, categories: results });
    }
  });
});
// Fetch sales from MySQL
app.get('/api/sales', (req, res) => { 
  const query = 'SELECT * FROM sales'; 
  connection.query(query, (error, results) => { 
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(results); 
  }); 
}); 
// Fetch product from MySQL
app.get('/product', (req, res) => { 
  const query = 'SELECT * FROM product'; 
  connection.query(query, (error, results) => { 
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(results); 
  }); 
}); 
app.get('/product/search', (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query parameters

  // Check if the search term is provided
  if (!searchTerm) {
    return res.status(400).json({ success: false, message: 'Search term is required' });
  }

  // Query to search for products based on the search term in Product_Name or Product_ID
  const query = 'SELECT * FROM product WHERE Product_Name LIKE ? OR Product_ID LIKE ?';
  const searchValue = `%${searchTerm}%`; // Add wildcard characters for partial matching
  connection.query(query, [searchValue, searchValue], (error, results) => {
    if (error) {
      console.error('Error searching products:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    // Check if any products were found
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    } else {
      return res.status(200).json({ success: true, products: results });
    }
  });
});

// Endpoint to add stock to a product
app.post('/api/add-stock', (req, res) => {
  const { productId, stock } = req.body;

  if (!productId || !stock) {
    return res.status(400).json({ error: 'Product ID and stock are required' });
  }

  const addStockQuery = `
    UPDATE product
    SET Stock = Stock + ?
    WHERE Product_ID = ?;
  `;

  connection.query(addStockQuery, [stock, productId], (error, results) => {
    if (error) {
      console.error('Error updating stock:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Stock added successfully' });
  });
});
app.get('/categoryId', (req, res) => { 
  const query = 'SELECT Category_ID FROM category'; 
  connection.query(query, (error, results) => { 
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(results); 
  }); 
}); 
app.get('/api/products/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  const query = 'SELECT Product_ID FROM Product WHERE Category_ID = ?';
  connection.query(query, [categoryId], (error, results) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(results); // Send the results as an array of product IDs
  });
});

// Fetch categories from MySQL to the select menu in the Product page
app.get('/api/select/category', (req, res) => { 
  const query = 'SELECT Category_ID, Category_Name FROM category'; // Select Category_ID and Category_Name
  connection.query(query, (error, results) => { 
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(results); // Directly send the results containing Category_ID and Category_Name
  }); 
});

// Fetch products by category ID
app.get('/api/select/product/:categoryId', (req, res) => { 
  const categoryId = req.params.categoryId;
  const query = 'SELECT Product_ID, Product_Name FROM Product WHERE Category_ID = ?';
  connection.query(query, [categoryId], (error, results) => { 
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(results); // Directly send the results containing Product_ID and Product_Name
  }); 
});
// Fetch product details by product ID
app.get('/api/select/productPrice/:productId', (req, res) => {
  const productId = req.params.productId;
  const query = 'SELECT Price FROM Product WHERE Product_ID = ?';
  connection.query(query, [productId], (error, results) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal server error');
      return;
    }
    res.json(results[0]); // Send the first (and should be the only) result as a single object
  });
});
// Insert data into MySQL
app.post('/product/add', (req, res) => {
  const { Product_Name, Price, Category_ID, Stock } = req.body;

  // Find the maximum product ID for the given category
  const maxProductIdSql = 'SELECT MAX(Product_ID) AS maxProductId FROM product WHERE Category_ID = ?';
  connection.query(maxProductIdSql, [Category_ID], (err, results) => {
    if (err) {
      console.error('Error retrieving max product ID:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Determine the next product ID for the given category
    let nextProductIdNumeric = 1;
    if (results[0].maxProductId) {
      const lastProductIdNumeric = parseInt(results[0].maxProductId.split('-')[1]);
      if (!isNaN(lastProductIdNumeric)) {
        nextProductIdNumeric = lastProductIdNumeric + 1;
      }
    }
    const nextProductId = `${Category_ID}-${nextProductIdNumeric}`;

    // Insert the new product into the database
    const insertSql = 'INSERT INTO product (Product_ID, Product_Name, Price, Category_ID, Stock) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertSql, [nextProductId, Product_Name, Price, Category_ID, Stock], (err, result) => {
      if (err) {
        console.error('Error inserting product:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      console.log('Product inserted successfully');
      res.status(200).json({ success: true, message: 'Product inserted successfully' });
    });
  });
});

app.delete('/product/delete/:productName', (req, res) => {
  const productName = req.params.productName;

  // Get the product's category ID and product number
  const getProductInfoSql = 'SELECT Product_ID, Category_ID FROM product WHERE Product_Name = ?';
  connection.query(getProductInfoSql, [productName], (err, results) => {
    if (err) {
      console.error('Error retrieving product information:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (results.length === 0) {
      // No product found with the given name
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const categoryId = results[0].Category_ID;
    const productId = results[0].Product_ID;

    // Delete the product from the database
    const deleteSql = 'DELETE FROM product WHERE Product_Name = ?';
    connection.query(deleteSql, [productName], (err, result) => {
      if (err) {
        console.error('Error deleting product from database:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (result.affectedRows === 0) {
        // No product found with the given name
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Get the remaining products in the same category with higher product numbers
      const getRemainingProductsSql = 'SELECT Product_Name FROM product WHERE Category_ID = ? AND Product_ID > ? ORDER BY Product_ID ASC';
      connection.query(getRemainingProductsSql, [categoryId, productId], (err, results) => {
        if (err) {
          console.error('Error retrieving remaining products:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Update the product IDs for the remaining products
        let updateSql = 'UPDATE product SET Product_ID = ? WHERE Product_Name = ?';
        let prevProductId = productId;
        results.forEach((row) => {
          const productNameToUpdate = row.Product_Name;
          const newProductId = `${categoryId}-${prevProductId.split('-')[1]}`;
          connection.query(updateSql, [newProductId, productNameToUpdate], (err, result) => {
            if (err) {
              console.error('Error updating product ID:', err);
              return res.status(500).json({ success: false, message: 'Internal server error' });
            }
          });
          prevProductId = newProductId;
        });

        return res.status(200).json({ success: true, message: 'Product deleted successfully' });
      });
    });
  });
});app.post('/product/delete/bulk', (req, res) => {
  const productNames = req.body.productNames;

  // Ensure that productNames is an array
  if (!Array.isArray(productNames) || productNames.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or empty product names array' });
  }

  // Track the number of products deleted
  let deletedCount = 0;

  // Iterate through each product name
  productNames.forEach((productName, index) => {
    // Get the product's category ID and product number
    const getProductInfoSql = 'SELECT Product_ID, Category_ID FROM product WHERE Product_Name = ?';
    connection.query(getProductInfoSql, [productName], (err, results) => {
      if (err) {
        console.error('Error retrieving product information:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (results.length === 0) {
        // No product found with the given name
        return res.status(404).json({ success: false, message: `Product '${productName}' not found` });
      }

      const categoryId = results[0].Category_ID;
      const productId = results[0].Product_ID;

      // Delete the product from the database
      const deleteSql = 'DELETE FROM product WHERE Product_Name = ?';
      connection.query(deleteSql, [productName], (err, result) => {
        if (err) {
          console.error('Error deleting product from database:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
          // No product found with the given name
          return res.status(404).json({ success: false, message: `Product '${productName}' not found` });
        }

        deletedCount++;

        // If it's the last product name in the array, return success response
        if (deletedCount === productNames.length) {
          return res.status(200).json({ success: true, message: 'Products deleted successfully' });
        }
      });
    });
  });
});
app.post('/api/deduct-stocks', (req, res) => {
  const { productId, quantity } = req.body;

  // Check if productId and quantity are provided
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }

  // Assuming you have a database table named 'products' with columns 'Product_ID' and 'Stock'
  const sql = `SELECT * FROM product WHERE Product_ID = ?`;

  // Fetch the product from the database
  connection.query(sql, [productId], (error, results) => {
    if (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if product exists
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = results[0];

    // Check if there are enough stocks available
    if (product.Stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stocks' });
    }

    // Deduct the quantity from stocks
    const updatedStock = product.Stock - quantity;
    const updateSql = `UPDATE product SET Stock = ? WHERE Product_ID = ?`;
    connection.query(updateSql, [updatedStock, productId], (updateError) => {
      if (updateError) {
        console.error('Error updating product stock:', updateError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(200).json({ message: 'Stocks deducted successfully' });
    });
  });
});
// Endpoint to insert sales
app.post('/api/insert-sale', (req, res) => {
  const { Product_ID, Category_ID, Quantity, Price, Reference_Number } = req.body;
  const Sale_Date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date and time
  
  const sql = `INSERT INTO sales (Product_ID, Category_ID, Quantity, Sale_Date, Price, Reference_Number) 
  VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [Product_ID, Category_ID, Quantity, Sale_Date, Price, Reference_Number], (error, results) => {
    if (error) {
      console.error('Error inserting sale:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json({ message: 'Sale inserted successfully' });
  });
});
app.get('/api/sales/frequent-products', (req, res) => {
  // Query to find all products with purchase frequencies
  const frequentProductsQuery = `
    SELECT p.product_id, p.product_name, p.category_id, p.stock, COUNT(*) AS purchase_frequency
    FROM product p
    JOIN sales s ON p.product_id = s.product_id
    GROUP BY p.product_id
    ORDER BY purchase_frequency DESC;
  `;

  connection.query(frequentProductsQuery, (error, results) => {
    if (error) {
      console.error("Error fetching frequent products:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    res.status(200).json(results);
  });
});
// Endpoint to check stock and declare status
app.get('/api/products/critical', (req, res) => {
  const criticalStockThreshold = 5; // Define the critical stock threshold

  // Query to get all products with stock below the critical threshold
  const criticalProductsQuery = `
    SELECT *
    FROM product
    WHERE stock <= ?;
  `;

  connection.query(criticalProductsQuery, [criticalStockThreshold], (error, results) => {
    if (error) {
      console.error("Error fetching critical products:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No critical products found" });
    }

    res.status(200).json(results);
  });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { 
  console.log('Server running on port 3001'); 
});
//SET @num := 0;
//UPDATE users SET ID = @num := @num + 1;
//ALTER TABLE users AUTO_INCREMENT = 1;
//2UQBNJS6APUZWTQ3Q27RXQR4