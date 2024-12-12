"use client"
import { useState } from 'react';

const slippageTolerance = 10;
export default function Trade({ dexes, trade, token, signer }) {
    const dex = dexes.find(dex => dex.address === trade.address);
    const [processing, setProcessing] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState(false);

    const executeTrade = async () => {
        setProcessing(true);
        try {
            const amountInMax = BigInt(Math.floor(Number(trade.amountIn) * (1 + (slippageTolerance / 100))));
            console.log("amountInMax", amountInMax);
            const tx1 = await token.approve(dex.address, amountInMax);
            const receipt1 = await tx1.wait();
            if (receipt1.status !== "1") {
                throw new Error("approve() transaction failed");
            }

            const to = await signer.getAddress();
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
            console.log("signer address: " + to);
            console.log("deadline: " + deadline);
            const tx2 = await dex.contract.swapTokensForExactTokens(
                trade.amountOut,
                amountInMax,
                [trade.tokenIn, trade.tokenOut],
                to,
                deadline
            )
            const receipt2 = await tx2.wait();
            if (receipt2.status !== "1") {
                throw new Error("Trade failed");
            }
            setConfirmed(true);
        } catch (e) {
            console.log(e);
            setError(true)
        } finally {
            setProcessing(false)
        }

    }

    return (
        <>
            <h2 className="fw mt-3">The best price was found!</h2>
            <ul className="list-group mb-3">
                <li className="list-group-item">Exchange: {dex.name}</li>
                <li className="list-group-item">Token to sell: {trade.tokenInSymbol}</li>
                <li className="list-group-item">Amount of the token to sell: {Number(trade.amountIn.toString()) / (10 ** 6)}</li>
                <li className="list-group-item">Token to buy: {trade.tokenOutSymbol}</li>
                <li className="list-group-item">Amount of the token to buy: {Number(trade.amountOut) / (10 ** 18)}</li>
                <li className="list-group-item">Slippage tolerance: {slippageTolerance}</li>
            </ul>
            <button className="btn btn-primary" onClick={executeTrade} disabled={processing}>Trade</button>
            {processing && <div className="alert alert-info mt-4 mb-0" >Your trade is processing. Please wait...</div>}
            {confirmed && <div className="alert alert-info mt-4 mb-0" >Congrats. Your trade was successfully executed!</div>}
            {error && <div className="alert alert-danger mt-4 mb-0" >Ooops... Your trade failed. Please try again later.</div>}
        </>
    )
}