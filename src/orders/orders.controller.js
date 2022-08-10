const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//validators

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

//get order by id
const read = (req, res) => {
  res.json({ data: res.locals.order });
};
//get all the orders
const list = (req, res) => {
  res.json({ data: orders });
};

module.exports = {
  read: [isOrderExists, read],
  list,
};
