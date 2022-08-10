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

//check if id meet createria for updating order
const idMatchesRouteParam = (req, res, next) => {
  const { id } = req.body.data;
  const { orderId } = req.params;
  return !id || id === orderId
    ? next()
    : next({
        status: 400,
        message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
      });
};

//check order status
const checkOrderStatus = (req, res, next) => {
  const { data: { status } = {} } = req.body;
  const orderStatus = ["pending", "preparing", "out-for-delivery"];
  if (orderStatus.includes(status)) {
    next();
  } else if (status === "delivered") {
    next({
      status: 400,
      message: `A delivered order cannot be changed.`,
    });
  } else {
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered.",
    });
  }
};

//check order if is pending
const isOrderPending = (req, res, next) => {
  const order = res.locals.order;
  if (order.status === "pending") {
    next();
  } else {
    next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
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

//update order
const update = (req, res, next) => {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;

  res.json({ data: order });
};

//get order by id
const read = (req, res) => {
  res.json({ data: res.locals.order });
};

//delete order
const destroy = (req, res) => {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  const deleteOrder = orders.splice(index, 1);
  res.sendStatus(204);
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
  update: [
    bodyHasProperty("deliverTo"),
    bodyHasProperty("mobileNumber"),
    bodyHasProperty("status"),
    bodyHasProperty("dishes"),
    isOrderExists,
    isDishArrayWithContent,
    idMatchesRouteParam,
    isDishQuantity,
    checkDishQuantity,
    checkOrderStatus,
    update,
  ],
  read: [isOrderExists, read],
  delete: [isOrderExists, isOrderPending, destroy],
  list,
};
