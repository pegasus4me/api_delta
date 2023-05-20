import * as dotenv from "dotenv"
import express, { Express, Request, Response, NextFunction } from "express"
import cors from 'cors'
import axios from 'axios'
import { Data_acces } from "./types"

///////////////

dotenv.config()
const app: Express = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))


const fetch_market = async (base_URL: string, pair1: string, pair2: string) => {
    let fetch = await axios.get(`${base_URL}/api/v1/market/histories?symbol=${pair1}-${pair2}`)
    return fetch.data
}

app.get('/api/v1/delta', async (req: Request, res: Response, next: NextFunction) => {
    let base_URL: string = "https://api.kucoin.com"
    let startDeltaIndex: number = 0 // neutral 
    
    /**
     *  buy === increment delta by sum = tot buy from index 
     *  sell === decrement delta by sum = tot sell from index
     */

    try {
        let data = await fetch_market(base_URL, "ETH", "USDT")
        let value = data.data
        let all_buy: number = 0
        let all_sell: number = 0
        for (let i = 0; i < value.length; i++) {
            let type_of_transaction = value[i].side
            let amount_value = value[i].size

            if (type_of_transaction === "buy") {
                all_buy += parseFloat(amount_value)
            } else {
                all_sell += parseFloat(amount_value)
            }


        }
        let totalDelta: number = all_buy - all_sell
        return res.json({ totalDelta })
    } catch (error) {
        next(error);
    }

})


const port = process.env.PORT;
app.listen(port, () => {
    return console.log(`⚡️ server is on port http://localhost:${port}`)
})

