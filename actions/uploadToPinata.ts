import axios from "axios";

export const uploadToPinata = async (file: File) => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append('file', file);

    const apiKey = "69bc12652fdfb42f5345";
    const apiSecret = "ac09c873b88cd24fc25695e8c93628a2a4a255bd25722301d40d4cba19310e11";

    try {
      const response = await axios.post(url, formData, {
        maxContentLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data`,
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });
      
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw error;
    }
};

export const handleUploadToPinata = async (file: File) => {
    if (!file) {
      alert("Please select a file to Upload!");
      return;
    }
    try {
      const ipfsHash = await uploadToPinata(file);
      return ipfsHash
    } catch (error) {
      console.log(error)
      alert("Failed to upload conetnt.");
    }
}