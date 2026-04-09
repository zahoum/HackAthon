import express from "express";
import connectDB from "./conn.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const app = express();
const ipV4 = '192.168.0.213';
const port = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
 * CREATE new book
 */
app.post('/api/v1/livre', async (req, res) => {
    try {
        const { title, author, year } = req.body;

        if (!title || !author || !year) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const newBook = { title, author, year };

        const result = await db.collection("books").insertOne(newBook);

        res.status(200).json({
            _id: result.insertedId,
            title,
            author,
            year
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating book' });
    }
});

/**
 * UPDATE book
 */
app.put('/api/v1/livre/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { title, author, year } = req.body;

        const result = await db.collection("books").updateOne(
            { _id: id },
            { $set: { title, author, year } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating book' });
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

        if (!bookId || !userId) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const newBorrow = {
            bookId,
            userId,
            rentDate,
            returnDate
        };

        const result = await db.collection("rentedBooks").insertOne(newBorrow);

        res.status(200).json({
            _id: result.insertedId,
            ...newBorrow
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating borrow record' });
    }
});

/**
 * UPDATE borrow (mark as returned)
 */
app.put('/api/v1/emprunt/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);

        const result = await db.collection("rentedBooks").updateOne(
            { _id: id },
            { $set: { isReturned: true } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        res.status(200).json({ message: 'Borrow updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating borrow record' });
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