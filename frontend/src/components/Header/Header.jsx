import { useState, useEffect } from 'react';
import { utils } from 'ethers';
import contractInstance from '../../ContractInstance/ContractInstance';
import './Header.css'
import ModalContent from './ModalContent/ModalContent';

function Header({ walletConnected , account}) {
  // const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [isSuccess, setIsSuccess] = useState(false); 
  const [txHash, setTxHash] = useState(""); 
  const [registeredDAOs, setRegisteredDAOs] = useState([]); 
  const [ethPrice, setEthPrice] = useState(); 
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("")

  const checkDAOsPresent = async () => {
    try {
      // e.preventDefault();
      // const verify = await contractInstance(true); 
      // Using farmDao to check addresses 
      const farmDAO = await contractInstance(false); 

      
      setIsLoading(true); 
      // const tx = await verify.getAllDaos({ gasLimit: 1000000 }); 
      const daos = await farmDAO.getAllDaos(); 
      // await daos.wait(); 

      console.log("All DAOs are: ", daos);
      setRegisteredDAOs(daos);  
      
      setIsLoading(false); 
      setTxHash(daos.hash); 

      setIsSuccess(true); 

      setTimeout(() => {
        setIsSuccess(false)
      }, 5000); 

    } catch (error) {
      console.error(error)
    }
  }
  
  // Complete this code
  const verifyDAO = async (daoId) => {
    try {
      console.log("Verifying DAO...")
      const farmDAO = await contractInstance(true);
      
      const lowerCaseAccount = account.toLowerCase(); 
      const isAddressVerified = await farmDAO.isAddressVerified(lowerCaseAccount);

      // Assuming the contract has a function isAddressVerified(address) to check if an address is verified

      if (!isAddressVerified) {
        console.error("Unauthorized access");
        return;
      }
  
      await farmDAO.verifyDao(daoId);
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = async (title, itemId, item) => {
    
    const hyperlinkTag = item.investors.map((investor) => (
      <a href={`https://sepolia.etherscan.io/address/${investor}`} target='_blank' className='investors'>{investor.slice(0,6)}...{investor.slice(38,42)}</a>
    ));
  
    const contentHeader = (
      <div className='content-container'>
        <h2 className='dao-name'>{item.financialReports}</h2>
        <div className="description">
          <p>{item.description}</p>
        </div>
        <div className="invested-form">
          <p className='descriptionArea'>Total Amount Invested</p>
          <p className='descriptionArea'>{(parseFloat(utils.formatEther(item.amountInvested))*ethPrice).toFixed(5)} USD</p>
        </div>
      </div>
    );
  
    const daoContent = (
      <div className="content-container">
        {contentHeader}
        <div className='reports-container'>
          <div className='reports'>
            <div>
              <a href={item.farmReports} target='_blank'>Financial Reports</a>
            </div>
            <div>
              <a href={item.name} target='_blank'>Farm Reports</a>
            </div>
          </div>
          <div className="invested-form">
            <div>
              <p className='descriptionArea'>Investors</p>
              <div className='descriptionArZea'>
                {hyperlinkTag}
              </div>
            </div>
            <div>
              <p className='descriptionArea'>Owners</p>
              <div className='descriptionArea'>
                <a href={`https://sepolia.etherscan.io/address/${item.address1}`} target='_blank'>{item.address1.slice(0,6)}...{item.address1.slice(38,42)}</a>
                <a href={`https://sepolia.etherscan.io/address/${item.address2}`} target='_blank'>{item.address2.slice(0,6)}...{item.address2.slice(38,42)}</a>
              </div>
            </div>
          </div> 
        </div>
        <div>
          <button className="withdraw-button" onClick={() => verifyDAO(item.id)}>Verify DAO</button>
          <button className="exit-button" onClick={handleCloseModal}>Exit</button>
        </div>
      </div>
    );
  
    // const investContent = (
    //   <div className='content-container'>
    //     {contentHeader}
    //     <div>
    //       <label>Amount: </label>
    //       <input 
    //         className='invest-input'
    //         type="number" 
    //         placeholder="Enter amount to invest in dollars (USD)" 
    //         name="DaoName"
    //         onChange={async (e) => {
    //           investAMT = e.target.value; 
    //           const priceInEth = await getPriceConsumer(investAMT); 
    //           console.log("Price in eth is: ", priceInEth); 
    //           setInvestmentAmount(priceInEth); 
    //         }}
    //       />
    //     </div>
    //     <button className="close-btn" onClick={() => investDao(investAMT, parseInt(itemId))}>INVEST</button> 
    //     <div>
    //       <button className="withdraw-button" onClick={() => setModalContent(daoContent)}>Check DAO details</button>
    //       <button className="exit-button" onClick={handleCloseModal}>Exit</button>
    //     </div>
    //   </div>
    // );
    
    // Setting title to Invest 
    setModalTitle(title);

    // Setting the modal content
    setModalContent(daoContent);
    
    setShowModal(true);
  }

  useEffect(() => {
    checkDAOsPresent(); 
    setTimeout(() => {
      let elements = document.getElementsByClassName('success-div');
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
      }
    }, 3000)
  }, [])
  

  return (
    <div className='container'>

      <div className='header-logo'>
        <h1 className='title'>P2C Admin</h1>
        {/* <img src='./logo4.png' alt="logo" /> */}
      </div>
       
      {
        !walletConnected ? (
            <div className='warning-box'>
              <p>Connect your wallet to get started</p><br/>
              {/* <p>Check out the <a href='https://github.com/Stephen-Kimoi/dApp-starter-kit#readme' target='_blank'>documentation</a></p> */}
            </div>
        ) : (
            <div className='message-container'>
              <p>DAOs created</p>
                  {registeredDAOs.length > 0 &&
                    <div className="card-container">
                      {registeredDAOs.map((item, index) => (
                        <div key={index} className="card">
                          <div className="card-info">
                            <h3>{item.financialReports}</h3> {/* THIS IS A BUG -- MAKE CHANGESS */}
                            <div>Farmer Address 1: {item.address1.slice(0,6)}...{item.address1.slice(38,42)}<br/>Farmer Address 2: {item.address2.slice(0,6)}...{item.address2.slice(38,42)}</div>
                            <p>DESCRIPTION: {item.description}</p>
                            {/* <p>FUNDS INVESTED: {(parseFloat(utils.formatEther(item.amountInvested))*ethPrice).toFixed(5)} USD</p> */}
                            {/* <p>FUNDS INVESTED: {(parseFloat(utils.formatEther(item.amountInvested))*ethPrice).toFixed(5)} USD</p> */}
                          </div>
                          <div className="card-buttons">
                            <button onClick={() => handleShowModal("INVEST", item.id.toString(), item)}>DAO details</button>
                          </div>
                          {
                            !item.verified ? (
                              <div className='status'>
                                <p className='pending'>Pending</p>
                              </div>
                            ) : (
                              <div className='status'>
                                <p className='approved'>Approved</p>
                              </div>
                            )
                          }
                        </div>
                      ))}
                    </div>
                  }

            </div>
        )
      }

      <ModalContent 
        handleShowModal={handleShowModal}
        handleCloseModal={handleCloseModal}
        showModal={showModal}
        modalTitle={modalTitle}
        modalContent={modalContent}
      />

    </div>
  );
}

export default Header;
