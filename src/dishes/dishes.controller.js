const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//check if dish exist
const isDishExists = (req, res, next) => {
  const { dishId } = req.params;
  const getDish = dishes.find((dish) => dish.id === dishId);
  if (getDish) {
    res.locals.dish = getDish;
    return next();
  } else {
    next({ status: 404, message: `Dish id not found: ${dishId}.` });
  }
};

///validate price property if is greater than an int and greater than 0
const pricePropertyIsvalid = (req, res, next) => {
  const { data: { price } = {} } = req.body;
  return Number.isInteger(Number(price)) && price > 0
    ? next()
    : next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0",
      });
};

//validate  property value
const bodyDataHas = (propertyName) => {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (data[propertyName]) return next();
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
};

//create dish handler
const create = (req, res, next) => {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};

//get dish by id
const read = (req, res) => {
  res.json({ data: res.locals.dish });
};

//get all the dishes
const list = (req, res) => {
  res.json({ data: dishes });
};

module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    pricePropertyIsvalid,
    create,
  ],
  read: [isDishExists, read],
  list,
};
