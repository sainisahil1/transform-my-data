import express from 'express';
import {TransformedUserData} from "./types";
import {initiateProcessing} from "./index";

export const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/users', async (req, res) => {
    try {
        const finalData: TransformedUserData = await initiateProcessing();
        res.json(finalData);
    } catch (error){
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: "An unknown error occurred"});
        }
    }
})

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Get users at http://localhost:${PORT}/api/users`);
})
