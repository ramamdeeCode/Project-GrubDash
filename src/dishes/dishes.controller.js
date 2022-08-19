const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

/*--------------------------------validators---------------------------*/

//check if dish exist middleware
function isDishExists(req, res, next) {
  const { dishId } = req.params;
  const getDish = dishes.find((dish) => dish.id === dishId);
  if (getDish) {
    res.locals.dish = getDish;
    return next();
  } else {
    next({ status: 404, message: `Dish id not found: ${dishId}.` });
  }
}

//check if id meet createria for updating dish middleware
function idMatchesRouteParam(req, res, next) {
  const { id } = req.body.data;
  const { dishId } = req.params;
  return !id || id === dishId
    ? next()
    : next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
      });
}

//validate price property if is greater than an int and greater than 0 middleware
function pricePropertyIsvalid(req, res, next) {
  const { data: { price } = {} } = req.body;
  return typeof price === "number" && price > 0
    ? next()
    : next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0",
      });
}

//validate  property value middleware
function bodyDataHas(propertyName) {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (data[propertyName]) return next();
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

/* ----------------dishes handlers needed to make the tests pass --------------*/

//Create Handler
function create(req, res, next) {
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
}

//Update Handler
function update(req, res) {
  const dish = res.locals.dish;

  const { data: { name, description, price, image_url } = {} } = req.body;

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

//read handler
function read(req, res) {
  res.json({ data: res.locals.dish });
}

//list handler
function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    pricePropertyIsvalid,
    create,
  ],
  update: [
    isDishExists,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    idMatchesRouteParam,
    pricePropertyIsvalid,
    update,
  ],
  read: [isDishExists, read],
  list,
};
