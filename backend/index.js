import express from "express";
import connectDB from "./conn.js";

const app = express();
let ipV4 = '192.168.1.37';

const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
let db = await connectDB()



app.get('/', ( req, res) => {
    res.send('Hello World!');
});
app.listen(port, ipV4, () => {
    console.log(`Server is running at http://${ipV4}:${port}`);
});

app.get('/api/v1/livre/:id', async (req, res) => {
    try {
         const id = req.params.id;
         const book = await db.collection("books").findOne({ _id: id });
         res.status(200).json(book);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Book not found' });
    }

});

app.post('/api/v1/livre', async (req, res) => {
    try {
        const { title, author, year } = req.body;
        const newBook = { title, author, year };
        const result = await db.collection("books").insertOne(newBook);
        res.status(200).json(result.ops[0]);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Error creating book' });
    }
});


app.put('/api/v1/livre/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, author, year } = req.body;
        const updatedBook = { title, author, year };
        const result = await db.collection("books").updateOne({ _id: id }, { $set: updatedBook });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating book' });
    }
});


app.delete('/api/v1/livre/:id', async (req, res) => {
    try {
        const id = req.params.id;
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


app.post('/api/v1/emprunt', async (req, res) => {
    try {
        const { bookId, userId, rentDate, returnDate } = req.body;
        const newBorrow = { bookId, userId, rentDate, returnDate };
        const result = await db.collection("rentedBooks").insertOne(newBorrow);
        res.status(200).json(result.ops[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating borrow record' });
    }
}
);


app.put('/api/v1/emprunt/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.collection("books").updateOne({ _id: id }, { $set: { isRented: false } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }
        res.status(200).json({ message: 'Borrow record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating borrow record' });
    }
});



app.get('/api/v1/emprunt/:id', async (req, res) => {
    try {
        const id = req.params.id;
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




app.post('/api/v1/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        password = await bcrypt.hash(password, 10);
        const newUser = { username, password };
        const result = await db.collection("users").insertOne(newUser);
        res.status(200).json(result.ops[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

app.post('/api/v1/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.collection("users").findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login' });
    }
});