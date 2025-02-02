import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import faqRoutes from './routes/faqRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use('/api/faqs', faqRoutes);

app.get('/', (req, res) => res.send('Welcome to FAQ API'));

// app.get('/get', async (req, res) => {
//     const getReq = await fetch('http://localhost:3100/api/faqs');
//     const data = await getReq.json();
//     res.json(data);

// });

// app.get('/add', async (req, res) => {
//     const postReq = await fetch(`http://localhost:3100/api/faqs/add`,{
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             question: 'What is your name?',
//             answer: 'My name is John Doe'
//         })
//     })
//     res.send('FAQ added');
// });
// app.get('/update/:id', async (req, res) => {
//     const postReq = await fetch(`http://localhost:3100/api/faqs/update/${req.params.id}`,{
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             question: 'What is your name?',
//             answer: 'My name is Piyush verma'
//         })
//     })
//     console.log(postReq);
//     res.send('FAQ updated');
// });
// app.get('/delete/:id', async (req, res) => {
//     const postReq = await fetch(`http://localhost:3100/api/faqs/delete/${req.params.id}`,{
//         method: 'DELETE',
//     })
//     res.send('FAQ deleted');
// });

app.use((_, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use(errorMiddleware);

export default app;
