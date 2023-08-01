import express from "express";

const app = express();

const PORT = '3005';

app.use(express.json());
app.use();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})