const fs = require("fs");
const mergeImages = require("merge-images");
const { Image, Canvas } = require("canvas");
const ImageDataURI = require("image-data-uri");
const TRAITS_DIRECTORY = "./traits";
const OUTPUT_DIRECTORY = "./outputs";

const main = () => {
  const { order } = JSON.parse(fs.readFileSync("./config.json"));
  const metadata = JSON.parse(fs.readFileSync("./metadata.json"));

  metadata.map(async (image, index) => {
    const ID = index + 1;
    const stackedRankedImages = order.map((cur) => {
      return `${TRAITS_DIRECTORY}/${cur}/${image[cur]}`;
    });
    const b64 = await mergeImages(stackedRankedImages, { Canvas, Image });
    await ImageDataURI.outputFile(b64, `${OUTPUT_DIRECTORY}/${ID}.png`);
    console.log(`COMPLETED ${ID}`);
  });
};

main();
