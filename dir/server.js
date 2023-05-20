"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
///////////////
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
const fetch_market = (base_URL, pair1, pair2) => __awaiter(void 0, void 0, void 0, function* () {
    let fetch = yield axios_1.default.get(`${base_URL}/api/v1/market/histories?symbol=${pair1}-${pair2}`);
    return fetch.data;
});
app.get('/api/v1/delta', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let base_URL = "https://api.kucoin.com";
    let startDeltaIndex = 0; // neutral 
    /**
     *  buy === increment delta by sum = tot buy from index
     *  sell === decrement delta by sum = tot sell from index
     */
    try {
        let data = yield fetch_market(base_URL, "ETH", "USDT");
        let value = data.data;
        let all_buy = 0;
        let all_sell = 0;
        for (let i = 0; i < value.length; i++) {
            let type_of_transaction = value[i].side;
            let amount_value = value[i].size;
            if (type_of_transaction === "buy") {
                all_buy += parseFloat(amount_value);
            }
            else {
                all_sell += parseFloat(amount_value);
            }
        }
        let totalDelta = all_buy - all_sell;
        return res.json({ totalDelta });
    }
    catch (error) {
        next(error);
    }
}));
const port = process.env.PORT;
app.listen(port, () => {
    return console.log(`⚡️ server is on port http://localhost:${port}`);
});
