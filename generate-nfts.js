import fs from "fs";
import canvas from "canvas";
import imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";

const { createCanvas, loadImage } = canvas;

const TRAITS_DIRECTORY = "./traits";
const OUTPUT_DIRECTORY = "./assets";
const WIDTH = 1000;
const HEIGHT = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createImage = async (order = [], image) => {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const context = canvas.getContext("2d");
  const ID = parseInt(image.id, 10) - 1;
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
  const optimizedImage = await imagemin.buffer(buffer, {
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
  fs.writeFileSync(`${OUTPUT_DIRECTORY}/${ID}.png`, optimizedImage);
};

const main = () => {
  const { order } = JSON.parse(fs.readFileSync("./config.json"));
  const randomSets = JSON.parse(fs.readFileSync("./random-sets.json"));
  const PROCESSING_LENGTH = 50;

  const processImage = async (marker = 0) => {
    const slice = randomSets.slice(marker, marker + PROCESSING_LENGTH + 1);

    // generate images for the portion
    await Promise.all(
      slice.map(async (image) => {
        await createImage(order, image);
      })
    );

    marker += PROCESSING_LENGTH;
    console.log(`Completed up to ${marker}, sleeping..`);
    await sleep(1000);
    if (marker < randomSets.length - 1) processImage(marker);
  };

  // recurse until completion
  processImage();
};

main();
