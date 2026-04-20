import express from "express";
import connectDB from "./conn.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import cors from "cors";

const app = express();
const ipV4 = 'localhost'; // Change this to your actual local IP address if needed
const port = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Connect to MongoDB
const db = await connectDB();

/* =========================================================
   ROOT ROUTE
========================================================= */
app.get('/', (req, res) => {
    res.send('Hello World!');
});

/* =========================================================
   START SERVER
========================================================= */
app.listen(port, ipV4, () => {
    console.log(`Server is running at http://${ipV4}:${port}`);
});

/* =========================================================
   📚 BOOK ROUTES
========================================================= */

/**
 * GET book by ID
 */
app.get('/api/v1/livre/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        

        const book = await db.collection("books").findOne({ _id: id });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Invalid ID format' });
    }
});

/**
 * CREATE new book (title, author, category)
 */
app.post('/api/v1/livre', async (req, res) => {
    try {
        const { title, author, category } = req.body; 

        if (!title || !author || !category) {  // ✅ Validating 'category'
            return res.status(400).json({ 
                message: "Missing fields. Required: title, author, category",
                received: { title, author, category }
            });
        }

        const newBook = { 
            title, 
            author, 
            category, 
            isRented: false  
        };

        const result = await db.collection("books").insertOne(newBook);

        res.status(201).json({
            _id: result.insertedId,
            title,
            author,
            category,
            isRented: false
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating book: ' + error.message });
    }
});

/**
 * DELETE book
 */
app.delete('/api/v1/livre/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);

        const result = await db.collection("books").deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting book' });
    }
});

/* =========================================================
   📦 BORROW (EMPRUNT) ROUTES
========================================================= */
/**
 * CREATE borrow record
 */
app.post('/api/v1/emprunt', async (req, res) => {
    try {
        const { bookId, userId, rentDate, returnDate } = req.body;

        console.log('Received borrow request:', req.body);
        console.log('BookId type:', typeof bookId, 'value:', bookId);
        console.log('UserId type:', typeof userId, 'value:', userId);

        // Check if fields exist
        if (!bookId) {
            return res.status(400).json({ 
                message: "bookId is required",
                received: req.body
            });
        }
        
        if (!userId) {
            return res.status(400).json({ 
                message: "userId is required",
                received: req.body
            });
        }

        // Validate ObjectId format
        const isValidObjectId = (id) => {
            return /^[0-9a-fA-F]{24}$/.test(id);
        };

        if (!isValidObjectId(bookId)) {
            return res.status(400).json({ 
                message: "Invalid bookId format. Must be a 24-character hex string",
                received: bookId
            });
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ 
                message: "Invalid userId format. Must be a 24-character hex string",
                received: userId
            });
        }

        // Convert string IDs to ObjectId
        const bookObjectId = new ObjectId(bookId);
        const userObjectId = new ObjectId(userId);

        // Check if book exists
        const bookExists = await db.collection("books").findOne({ _id: bookObjectId });
        if (!bookExists) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user exists
        const userExists = await db.collection("users").findOne({ _id: userObjectId });
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if book is already rented
        if (bookExists.isRented === true) {
            return res.status(400).json({ message: 'Book is already rented' });
        }

        const newBorrow = {
            bookId: bookObjectId,
            userId: userObjectId,
            rentDate: rentDate ? new Date(rentDate) : new Date(),
            returnDate: returnDate ? new Date(returnDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            isReturned: false,
            rentedAt: new Date()
        };

        const result = await db.collection("rentedBooks").insertOne(newBorrow);

        // Update the book's isRented status
        await db.collection("books").updateOne(
            { _id: bookObjectId },
            { $set: { isRented: true } }
        );

        res.status(200).json({
            success: true,
            _id: result.insertedId,
            message: "Book rented successfully",
            rental: {
                bookId: bookObjectId,
                userId: userObjectId,
                rentDate: newBorrow.rentDate,
                returnDate: newBorrow.returnDate
            }
        });

    } catch (error) {
        console.error('Error creating borrow record:', error);
        res.status(500).json({ message: 'Error creating borrow record: ' + error.message });
    }
});
/**
 * UPDATE book (title, author, category, isRented)
 */
app.put('/api/v1/livre/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { title, author, category, isRented } = req.body;

        // Build update object dynamically
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (author !== undefined) updateFields.author = author;
        if (category !== undefined) updateFields.category = category;
        if (isRented !== undefined) updateFields.isRented = isRented;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ 
                message: "No fields to update. Provide at least one field: title, author, category, or isRented"
            });
        }

        const result = await db.collection("books").updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ 
            message: 'Book updated successfully',
            updatedFields: updateFields
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating book: ' + error.message });
    }
});
/**
 * GET borrow by ID
 */
app.get('/api/v1/emprunt/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);

        const borrowRecord = await db.collection("rentedBooks").findOne({ _id: id });

        if (!borrowRecord) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        res.status(200).json(borrowRecord);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching borrow record' });
    }
});

/* =========================================================
   👤 AUTH ROUTES
========================================================= */

/**
 * SIGNUP
 */
app.post('/api/v1/signup', async (req, res) => {
    try {
        let { name, password, mail } = req.body;

        if (!name || !password || !mail) {
            return res.status(400).json({ message: "Missing fields" });
        }

        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ mail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        password = await bcrypt.hash(password, 10);

        const newUser = { name, password, mail };

        const result = await db.collection("users").insertOne(newUser);

        res.status(200).json({
            _id: result.insertedId,
            name,
            mail
        });

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * LOGIN
 */
app.post('/api/v1/login', async (req, res) => {
    try {
        const { mail, password } = req.body;

        const user = await db.collection("users").findOne({ mail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                mail: user.mail
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login' });
    }
});


//get all the books
app.get('/api/v1/livres', async (req, res) => {
    try {
        const books = await db.collection("books").find({}).toArray();
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching books' });
    }
});