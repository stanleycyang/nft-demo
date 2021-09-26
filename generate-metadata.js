import fs from "fs";
import weighted from "weighted";
import path from "path";
import _ from "lodash";

const NAME = "Smiley Facez NFT #";
const SYMBOL = "SFZ";
const DESCRIPTION = "Bringing joy through smiley facez to the world!";
const SELLER_FEE_BASIS_POINTS = 500;
const CREATORS = [
  { address: "2cJJk4N1LAYd1mKHpL4Tu7UsB77KBM5cbHNVktVi3djn", share: 100 },
];
const COLLECTION = {
  name: "Smiley Facez NFT",
  family: "Smiley Facez",
};
const NUMBER_OF_IMAGES_TO_CREATE = 100;

const generateRandomSet = (breakdown, id) => {
  const tmp = {};
  Object.keys(breakdown).forEach((attr) => {
    const randomSelection = weighted.select(breakdown[attr]);
    tmp[attr] = randomSelection;
  });

  return tmp;
};

const createMetadata = (attrs, index) => {
  const attributes = [];

  for (const prop in attrs) {
    attributes.push({
      trait_type: prop,
      value: path.parse(attrs[prop]).name,
    });
  }

  const metadata = {
    name: `${NAME}${index + 1}`,
    symbol: SYMBOL,
    image: `${index}.png`,
    properties: {
      files: [
        {
          uri: `${index}.png`,
          type: "image/png",
        },
      ],
      category: "image",
      creators: CREATORS,
    },
    description: DESCRIPTION,
    seller_fee_basis_points: SELLER_FEE_BASIS_POINTS,
    attributes,
    collection: COLLECTION,
  };

  fs.writeFileSync(`./assets/${index}.json`, JSON.stringify(metadata));
};

const main = () => {
  const randomSets = [];

  let numberOfImagesCreated = 0;
  const { breakdown } = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

  while (numberOfImagesCreated < NUMBER_OF_IMAGES_TO_CREATE) {
    const randomSet = generateRandomSet(breakdown, numberOfImagesCreated + 1);

    // ensure sets are completely unique
    if (!_.some(randomSets, randomSet)) {
      createMetadata(randomSet, numberOfImagesCreated);
      randomSets.push(randomSet);
      numberOfImagesCreated += 1;
    }
  }

  const randomSetsWithId = randomSets.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  fs.writeFileSync("./random-sets.json", JSON.stringify(randomSetsWithId));
};

main();
