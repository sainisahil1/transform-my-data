import express from 'express';
import {TransformedUserData, User, UsersResponse} from "./types";
import {fetchData, initiateProcessing, processUsers} from "./index";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/users', async (req, res) => {
    try {
        const finalData: TransformedUserData = await initiateProcessing();
        res.json(finalData);
    } catch (e){
        res.status(500).json(e);
    }
})

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Get users at http://localhost:${PORT}/api/users`);
})
