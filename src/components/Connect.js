"use client";
import { useState } from 'react';
import { ethers } from 'ethers';
export default function Connect({ setSigner }) {
    const [error, setError] = useState(undefined);
    const connect = async () => {
        if (!window.ethereum) {
            setError("Please install MetaMask to use this app.");
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            console.log("signer:", await signer.getAddress());
            setSigner(signer);
        } catch {
            setError("You need to accept the connection request first.");
        }
    }
    return (
        <div className="text-center">
            <button className="btn btn-primary btn-lg mt-1" onClick={connect}>Connect</button>
            {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
        </div>
    )

}