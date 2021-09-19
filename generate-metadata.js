const fs = require("fs");
const weighted = require("weighted");
const _ = require("lodash");

const generateRandomSet = (breakdown) => {
  const tmp = {};
  Object.keys(breakdown).forEach((attr) => {
    const randomSelection = weighted.select(breakdown[attr]);
    tmp[attr] = randomSelection;
  });

  return tmp;
};

const main = () => {
  const metadata = [];
  const NUMBER_OF_IMAGES_TO_CREATE = 10000;

  let numberOfImagesCreated = 0;
  const { breakdown } = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

  while (numberOfImagesCreated < NUMBER_OF_IMAGES_TO_CREATE) {
    const randomSet = generateRandomSet(breakdown);

    // ensure sets are completely unique
    if (!_.some(metadata, randomSet)) {
      metadata.push(randomSet);
      numberOfImagesCreated += 1;
    }
  }

  fs.writeFileSync("./metadata.json", JSON.stringify(metadata));
};

main();
