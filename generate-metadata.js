const fs = require("fs");
const weighted = require("weighted");
const _ = require("lodash");

const generateRandomSet = (breakdown, id) => {
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
    const randomSet = generateRandomSet(breakdown, numberOfImagesCreated + 1);

    // ensure sets are completely unique
    if (!_.some(metadata, randomSet)) {
      metadata.push(randomSet);
      numberOfImagesCreated += 1;
    }
  }

  const metadataWithId = metadata.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  fs.writeFileSync("./metadata.json", JSON.stringify(metadataWithId));
};

main();
