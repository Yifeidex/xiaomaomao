document.addEventListener("DOMContentLoaded", () => {
  const walletInfo = document.getElementById("walletInfo");
  const walletAddress = document.getElementById("walletAddress");
  const walletBalance = document.getElementById("walletBalance");

  // 钱包连接功能
  const connectButton = document.getElementById("connectButton");
  if (connectButton) {
    connectButton.addEventListener("click", async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          const balanceInEth = ethers.utils.formatEther(balance);
          walletAddress.innerText = address;
          walletBalance.innerText = balanceInEth;
          if (walletInfo) {
            walletInfo.classList.remove("hidden");
          }
        } catch (error) {
          console.error("Error connecting to wallet:", error);
        }
      } else {
        console.log("MetaMask is not installed!");
      }
    });
  }

  // 代币创建功能
  const createTokenButton = document.getElementById("createTokenButton");
  if (createTokenButton) {
    createTokenButton.addEventListener("click", async () => {
      const tokenName = document.getElementById("tokenName").value;
      const tokenSymbol = document.getElementById("tokenSymbol").value;
      const initialSupply = document.getElementById("initialSupply").value;

      const factoryAddress = "0x1b0f2c7dd983541775ba5d94ef45b4caf988ab88";
      const factoryABI = [
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "symbol",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "initialSupply",
              type: "uint256",
            },
          ],
          name: "createToken",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factory = new ethers.Contract(factoryAddress, factoryABI, signer);
      try {
        const tx = await factory.createToken(
          tokenName,
          tokenSymbol,
          initialSupply
        );
        await tx.wait();
        alert("Token created successfully!");
      } catch (error) {
        console.error("Failed to create token:", error);
        alert("Error creating token");
      }
    });
  }
});
