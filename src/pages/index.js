"use client";
import Connect from "../components/Connect.js";
import SearchTrade from "../components/SearchTrade.js";
import Trade from "../components/Trade.js";
import { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import blockchain from '../constants/blockchain.json';

export default function Home() {
  /** initialDexes
   * {
   * name:
   * address:
   * contract: undefined
   * }
   */

  const initialDexes = blockchain.dexes.map(dex => (
    {
      ...dex,
      ...{ contract: undefined }
    }
  ));
  const [signer, setSigner] = useState(undefined);
  const [availableDexes, setAvailableDexes] = useState(initialDexes);
  const [trade, setTrade] = useState(undefined);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    if (signer) {
      const newDexes = blockchain.dexes.map(dex => (
        {
          ...dex,
          ...{ contract: new Contract(dex.address, blockchain.dexAbi, signer) }
        }
      ));
      setAvailableDexes(newDexes);
    }
  }, [signer]);

  console.log("signer:", signer == undefined);
  // const tokenContract = new Contract(tokenIn, blockchain.erc20Abi, signer);
  // setToken(tokenContract);

  return (
    <div className="container-fluid mt-5 d-flex justify-content-center">
      <div id='content' className="row">
        <div id='content-inner' className="col">
          <div className="text-center">
            <h1>Dex Aggregator</h1>
            <p id="sub-title" className="mt-4 fw-bold"><span>Optimize your trades on DEXes</span></p>
          </div>
          {signer !== undefined ? (
            <>
              <SearchTrade
                availableDexes={availableDexes}
                signer={signer}
                setTrade={setTrade}
                setToken={setToken}
              />
              {trade && <Trade dexes={availableDexes} trade={trade} token={token} signer={signer} />}
            </>
          ) : (
            <Connect setSigner={setSigner} />
          )}


        </div>
      </div>
    </div>
  );
}
