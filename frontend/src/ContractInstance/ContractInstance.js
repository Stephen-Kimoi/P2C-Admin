import abi  from '../contracts/verify.json'; 
import { verify as contractAddress } from '../contracts/contracts-address.json'; 
import { ethers } from 'ethers';

const contractInstance = async (needSigner = false) => {
    try {
      let verify; 

      const provider = new ethers.providers.Web3Provider(window.ethereum); 
      const signer = await provider.getSigner(); 

      if (needSigner) {
        verify = new ethers.Contract(contractAddress, abi.abi, signer); 
      } else {
        verify = new ethers.Contract(contractAddress, abi.abi, provider); 
      }

      return verify;  
    } catch (error) {
        console.error(error)
    }
}

export default contractInstance; 

