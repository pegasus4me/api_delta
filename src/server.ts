import * as dotenv from "dotenv"
import express, { Express, Request, Response } from "express"
import cors from 'cors'
import axios from 'axios'
import { Data_acces } from "./types"

///////////////

dotenv.config()
const app: Express = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))


const HEADERS: Data_acces = {
    name: process.env.API_NAME,
    key: process.env.API_KEY,
    secret: process.env.API_SECRET
    

}


const fetch_market = async(base_URL : string, pair1: string, pair2 : string) => {
    let fetch  = await axios.get(`${base_URL}/api/v1/market/histories?symbol=${pair1}-${pair2}`)
    return fetch.data
}


app.get('/api/v1/delta', async (req: Request, res: Response) => {
    let base_URL: string = "https://api.kucoin.com"
    let startDeltaIndex: number= 0 // neutral 
    /**
     *  buy === increment delta by sum = tot buy from index 
     *  sell === decrement delta by sum = tot sell from index
     */

    try {
        let data = await fetch_market(base_URL, "BTC", "USDC" )
        let value = data.data
        for (let i = 0; i < value.length; i++) {
            let type_of_transaction = value[i].side
            let amount_value = value[i].size

            if(type_of_transaction === "sell") {
                startDeltaIndex -= amount_value
            } else {
                startDeltaIndex += amount_value
            }
            
            console.log("indexvalue :", startDeltaIndex)
        }
        return res.json({value})
    } catch (error) {
        res.json({error})
    }

})



const port = process.env.PORT;
app.listen(port, () => {
    return console.log(`⚡️ server is on port http://localhost:${port}`)
})


// fetch data from kucoin REST api
// create a API that can show me cumulative delta for a specific asset

// DELTA_NEUTRAL_CHECK


