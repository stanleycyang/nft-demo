const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
// const mergeImages = require("merge-images");
// const { Image, Canvas } = require("canvas");
// const ImageDataURI = require("image-data-uri");

const TRAITS_DIRECTORY = "./traits";
const OUTPUT_DIRECTORY = "./outputs";
const WIDTH = 1000;
const HEIGHT = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createImage = async (order = [], image) => {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const context = canvas.getContext("2d");
  await Promise.all(
    order.map(async (cur) => {
      const imageLocation = `${TRAITS_DIRECTORY}/${cur}/${image[cur]}`;
      const loadedImage = await loadImage(imageLocation);
      context.patternQuality = "best";
      context.quality = "best";
      context.drawImage(loadedImage, 0, 0, WIDTH, HEIGHT);
    })
  );

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`${OUTPUT_DIRECTORY}/${image.id}.png`, buffer);
};

const main = () => {
  const { order } = JSON.parse(fs.readFileSync("./config.json"));
  const metadata = JSON.parse(fs.readFileSync("./metadata.json"));
  const PROCESSING_LENGTH = 50;

  const processImage = async (marker = 0) => {
    const slice = metadata.slice(marker, marker + PROCESSING_LENGTH + 1);

    // generate images for the portion
    await Promise.all(
      slice.map(async (image) => {
        await createImage(order, image);
      })
    );

    marker += PROCESSING_LENGTH;
    console.log(`Completed up to ${marker}, sleeping..`);
    await sleep(1000);
    if (marker < metadata.length - 1) processImage(marker);
  };

  processImage();

  // metadata.map(async (image, index) => {
  //   const ID = index + 1;
  //   await createImage(order, ID, image);
  //   console.log(`COMPLETED ${ID}`);
  // });

  // metadata.map(async (image, index) => {
  //   const ID = index + 1;
  //   const stackedRankedImages = order.map((cur) => {
  //     return `${TRAITS_DIRECTORY}/${cur}/${image[cur]}`;
  //   });
  //   const b64 = await mergeImages(stackedRankedImages, { Canvas, Image });
  //   await ImageDataURI.outputFile(b64, `${OUTPUT_DIRECTORY}/${ID}.png`);
  //   console.log(`COMPLETED ${ID}`);
  // });
};

main();
