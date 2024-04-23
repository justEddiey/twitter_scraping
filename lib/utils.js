import fs from "fs";
import axios from "axios";

export const getPagingData = (result, page, limit, totalRecords) => {
  const totalResults = totalRecords;
  const totalPages = Math.ceil(totalResults / limit);

  return {
    currentPage: page,
    pageSize: limit,
    totalResults: totalResults,
    totalPages: totalPages,
    data: result.rows,
  };
};

export async function saveImageFromUrl(url) {
  if (!url) {
    return;
  }
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const fileId = url.split("/").pop().split("?")[0];
    const fileName = `${fileId}.jpg`;
    const directory = "./images/";

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    fs.writeFileSync(`${directory}${fileName}`, Buffer.from(response.data));

    console.log("Image saved successfully!");
  } catch (error) {
    console.error("Error saving image:", error);
  }
}
