
import config from "../config/config.dev.json";
const AZURE_CONNECTION_STRING = `${config.AZURE_CONNECTION_STRING}`;
const AZURE_CONTAINER_NAME = `${config.AZURE_CONTAINER_NAME}`;
const { BlobServiceClient } = require("@azure/storage-blob");
class AzureService{
    async uploadFile(files) {
        try {
        const blobServiceClient = new BlobServiceClient(AZURE_CONNECTION_STRING);
        const containerClient = await blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
        for (const file of files) {
          const blobName = file.name;
          const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
          await blockBlobClient.upload(file, file.size);
        }
    }
    catch{
        console.log("Upload ảnh lỗi!");
    }
    }
    
}
  
export default new AzureService();