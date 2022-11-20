# Project-GrubDash

## Installation 

1.  Fork / clone this repository.
2.  Run npm install.
3.  Use npm start to run the application.

## Description

* This is an API project following __RESTful design principles__ for a Grub-Dash-Front-End found [here](https://github.com/ramamdeeCode/grub-dash-front-end.git)

[Live Project](https://grub-dash-frontend.onrender.com)

![image](https://user-images.githubusercontent.com/86864383/183989221-3499e80c-8ada-447d-93a9-c99f148b48dd.png)





## Functionalities
This server work with two resources Dishes and Orders





Dishes | Routes | 
--- | --- | 
Create new Dish | POST /dishes | 
Update new Dish | PUT /dishes/:dishId |
Find Dish by id | GET /dishes/:dishId
List all the Dishes | GET /dishes



Orders | Routes | 
--- | --- | 
Create new Order | POST /orders | 
Update new Order | PUT /orders/:orderId |
Find Order by id | GET /orders/:orderId
Delete Order | Delete /orders/:orderId
List all the dishes | POST /orders




## Installation

1. Fork / clone this repository.
1. Run `npm install`.

Use `npm start` to run the application.

Set the `API_BASE_URL` environment variable to the base url for the API.

If `API_BASE_URL` is not set, a default value of `http://localhost:5000` is used.




