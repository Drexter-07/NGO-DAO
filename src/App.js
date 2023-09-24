import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { abi, contractAddress } from './abi'; // importing abi and contractAddress

function App() {
    const [orphans, setOrphans] = useState([]);
    const [contract, setContract] = useState(null);
    const [opCount, setOpCount] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [userAddress, setUserAddress] = useState("");


    const connectWallet = async () => {
      try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setIsConnected(true);
          setUserAddress(address);
      } catch (error) {
          console.error("Error connecting wallet", error);
      }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setUserAddress("");
};
 


    useEffect(() => {
        const init = async () => {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
                setContract(contract);

                const orphansCount = await contract.getOrphansCount();
                setOpCount(orphansCount.toNumber());
                //setting the count
                const orphansList = [];
                for (let i = 0; i < orphansCount; i++) {
                    const orphan = await contract.orphans(i);
                    orphansList.push({
                        name: orphan[0],
                        details: orphan[1],
                        wallet: orphan[2]
                    });
                }
                setOrphans(orphansList);
            } catch (error) {
                console.error("Error initializing contract", error);
            }
        };
        init();
    }, []);

    const donate = async (index, amount) => {
        try {
            const tx = await contract.donateToOrphan(index, { value: ethers.utils.parseEther(amount) });
            await tx.wait();
            alert("Donation successful!");
        } catch (error) {
            console.error("Error donating to orphan", error);
        }
    }

    return (
        <div className="App" style={{ backgroundColor: '#F4F4F4', minHeight: '100vh', color: '#333' }}>
            <header className="App-header" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {!isConnected ? (
                        <button onClick={connectWallet} style={{ padding: '10px', fontSize: '1em', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>Connect Wallet</button>
                    ) : (
                        <>
                            <p>Connected: {userAddress}</p>
                            <button onClick={disconnectWallet} style={{ padding: '10px', fontSize: '1em', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>Disconnect Wallet</button>
                        </>
                    )}
                    <div style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '1em', boxShadow: '0px 4px 6px #888888' }}>
                        <p>Total Orphans: {opCount}</p>
                    </div>
                </div>
                <h1 style={{ fontSize: '2.5em', textAlign: 'center', margin: '20px 0' }}>Hope for Tomorrow Foundation</h1>
                <p style={{ fontSize: '1em', textAlign: 'center', fontStyle: 'italic', margin: '10px 0' }}>A DAO Empowering Lives, One Act of Kindness at a Time</p>
                
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    {orphans.map((orphan, index) => (
                        <div key={index} className="card" style={{
                            width: '300px',
                            margin: '10px',
                            padding: '15px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #83a4d4, #b6fbff)',
                            color: '#333'
                        }}>
                            <h2 style={{ fontSize: '1.5em' }}>Name: {orphan.name}</h2>
                            <p style={{ fontSize: '1em' }}>Gender: {orphan.details}</p>
                            <p style={{ fontSize: '0.8em', marginBottom: '15px' }}>Orphan's Wallet address: {orphan.wallet}</p>
                            <input type="number" step="0.01" placeholder="Amount to donate in MATIC" id={`amount${index}`} style={{ marginBottom: '10px', padding: '5px', fontSize: '1em', width: '100%' }} />
                            <button onClick={() => donate(index, document.getElementById(`amount${index}`).value)} style={{ padding: '10px', fontSize: '1em', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>Donate</button>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
}

export default App;
