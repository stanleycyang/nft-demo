import fs from "fs";

const generateRandoms = (numberOfAttrs = 1, total = 100) => {
  const numbers = [];
  const loose_percentage = total / numberOfAttrs;

  for (let i = 0; i < numberOfAttrs; i++) {
    const random = Math.floor(Math.random() * loose_percentage) + 1;
    numbers.push(random);
  }

  const sum = numbers.reduce((prev, cur) => {
    return prev + cur;
  }, 0);

  numbers.push(total - sum);
  return numbers;
};

const main = () => {
  const configs = {
    breakdown: {},
  };

  const traits = fs.readdirSync("./traits");

  configs["order"] = traits;

  traits.forEach((trait) => {
    const attributes = fs.readdirSync(`./traits/${trait}`);
    const randoms = generateRandoms(attributes.length - 1);
    const tmp = {};

    attributes.forEach((attr, i) => {
      tmp[attr] = randoms[i] / 100;
    });

    configs["breakdown"][trait] = tmp;
  });

  fs.writeFileSync("./config.json", JSON.stringify(configs));
};

main();
