const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//validators

//check if dish is array and at list one concten

const isDishArrayWithContent = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;
  if (Array.isArray(dishes) && dishes.length > 0) {
    next();
  } else {
    next({
      status: 400,
      message: "Order must include at least one dish.",
    });
  }
};

//check dish have valid quantity
const checkDishQuantity = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;
  const index = dishes.findIndex(
    (dish) => dish.quantity <= 0 || typeof dish.quantity !== "number"
  );
  if (index == -1) {
    next();
  } else {
    next({
      status: 400,
      message: `Dish ${index} must have a quantity that is an integer greater than 0.`,
    });
  }
};
//check dish have quantiy property
const isDishQuantity = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;
  const index = dishes.findIndex((dish) => !dish.quantity);
  if (index == -1) {
    next();
  } else {
    next({
      status: 400,
      message: `Dish ${index} must have a quantity that is an integer greater than 0.`,
    });
  }
};

// a dish quantity property is missing	Dish ${index} must have a quantity that is an integer greater than 0
// a dish quantity property is zero or less	Dish ${index} must have a quantity that is an integer greater than 0
// a dish quantity property is not an integer	Dish ${index} must have a quantity that is an integer greater than 0

//check body have property
const bodyHasProperty = (propertyName) => {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      next();
    }
    next({
      status: 400,
      message: `Must include ${propertyName}`,
    });
  };
};
//check if order exist by id
const isOrderExists = (req, res, next) => {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  } else {
    next({
      status: 404,
      message: `Order does not exist: ${orderId}`,
    });
  }
};

// TODO: Implement the /orders handlers needed to make the tests pass

//create dish handler
const create = (req, res, next) => {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
};

//get order by id
const read = (req, res) => {
  res.json({ data: res.locals.order });
};
//get all the orders
const list = (req, res) => {
  res.json({ data: orders });
};

module.exports = {
  create: [
    bodyHasProperty("deliverTo"),
    bodyHasProperty("mobileNumber"),
    bodyHasProperty("dishes"),
    isDishArrayWithContent,
    isDishQuantity,
    checkDishQuantity,
    create,
  ],
  read: [isOrderExists, read],
  list,
};
