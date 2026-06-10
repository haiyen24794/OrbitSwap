const connectBtn =
  document.getElementById(
    'connectWallet'
  );

const approveBtn =
  document.getElementById(
    'approveBtn'
  );

const swapBtn =
  document.getElementById(
    'swapBtn'
  );

const status =
  document.getElementById(
    'status'
  );

const TOKEN_ADDRESS =
  "YOUR_ORBIT_TOKEN";

const SWAP_ADDRESS =
  "YOUR_SWAP_CONTRACT";

const TOKEN_ABI = [

  "function approve(address spender,uint256 amount) returns(bool)"
];

const SWAP_ABI = [

  "function swap(address tokenIn,address tokenOut,uint256 amount)"
];

let signer;

async function connectWallet(){

  if(!window.ethereum){

    alert("Please install MetaMask");

    return;
  }

  const provider =
    new ethers.BrowserProvider(
      window.ethereum
    );

  await provider.send(
    "eth_requestAccounts",
    []
  );

  signer =
    await provider.getSigner();

  const address =
    await signer.getAddress();

  connectBtn.innerText =
    address.slice(0,6) +
    "..." +
    address.slice(-4);
}

connectBtn.onclick =
  connectWallet;

approveBtn.onclick =
  async () => {

  try{

    const amount =
      document.getElementById(
        'amount'
      ).value;

    const token =
      new ethers.Contract(
        TOKEN_ADDRESS,
        TOKEN_ABI,
        signer
      );

    const tx =
      await token.approve(
        SWAP_ADDRESS,
        ethers.parseUnits(
          amount,
          18
        )
      );

    status.innerText =
      "Approving...";

    await tx.wait();

    status.innerText =
      "Approve Success";

  }catch(error){

    console.log(error);

    status.innerText =
      "Approve Failed";
  }

};

swapBtn.onclick =
  async () => {

  try{

    const amount =
      document.getElementById(
        'amount'
      ).value;

    const swap =
      new ethers.Contract(
        SWAP_ADDRESS,
        SWAP_ABI,
        signer
      );

    const tx =
      await swap.swap(
        TOKEN_ADDRESS,
        TOKEN_ADDRESS,
        ethers.parseUnits(
          amount,
          18
        )
      );

    status.innerText =
      "Swapping...";

    await tx.wait();

    status.innerText =
      "Swap Success";

  }catch(error){

    console.log(error);

    status.innerText =
      "Swap Failed";
  }

};
