'use client'
import { useState } from 'react';
import { ethers, Contract } from 'ethers';
import blockchain from '../constants/blockchain.json';

export default function SearchTrade({ availableDexes, signer, setTrade, setToken }) {
    const [tokenIn, setTokenIn] = useState("");
    // const [token, setToken] = useState("");
    const [tokenOut, setTokenOut] = useState("");
    const [amountOutETH, setAmountOutETH] = useState("");
    const amountOutWEI = (Number(amountOutETH) * (10 ** 18)).toString();

    const search = async (e) => {
        e.preventDefault();
        try {
            const calls = availableDexes.map((dex) => (
                dex.contract.getAmountsIn(amountOutWEI, [tokenIn, tokenOut])
            ));

            const tokenInContract = new Contract(tokenIn, blockchain.erc20Abi, signer);
            const tokenOutContract = new Contract(tokenOut, blockchain.erc20Abi, signer);
            setToken(tokenInContract);

            // Getting tokens symbols
            const tokenInSymbol = await tokenInContract.symbol();
            const tokenOutSymbol = await tokenOutContract.symbol();

            const quotes = await Promise.all(calls); // returns [[], [], []]
            const trades = quotes.map((quote, i) => (
                {
                    address: availableDexes[i].address,
                    amountIn: quote[0],
                    amountOut: amountOutWEI,
                    tokenIn,
                    tokenOut,
                    tokenInSymbol,
                    tokenOutSymbol
                }
            ));

            // sorting the trades by lowest first
            trades.sort((trade1, trade2) => (trade1.amountIn < trade2.amountIn ? -1 : 1));
            console.log("-------------------------");
            console.log(Number(trades[0].amountIn.toString()) / (10 ** 6));
            console.log(trades[0].address);
            console.log("-------------------------");
            console.log(Number(trades[1].amountIn.toString()) / (10 ** 6));
            console.log(trades[1].address);
            console.log("-------------------------");
            console.log(Number(trades[2].amountIn.toString()) / (10 ** 6));
            console.log(trades[2].address);
            setTrade(trades[0]);

        } catch (error) {
            console.log(error);
            throw new Error("Failed to get quotes.");
        }

        // }
    }
    return (

        <form onSubmit={search}>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="tokenIn"
                    placeholder="0xrs8565..."
                    onChange={e => setTokenIn(e.target.value)}
                    value={tokenIn}
                />
                <label htmlFor="tokenIn">Address of token to sell</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="tokenOut"
                    placeholder="0xUi8565..."
                    onChange={e => setTokenOut(e.target.value)}
                    value={tokenOut}
                />
                <label htmlFor="tokenOut">Address of token to buy</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="amountOutETH"
                    placeholder="1000..."
                    onChange={e => setAmountOutETH(e.target.value)}
                    value={amountOutETH}
                />
                <label htmlFor="amountOutETH">Amount of token to buy</label>
            </div>
            <button type='submit' className="btn btn-primary">Submit</button>
        </form>

    );
}