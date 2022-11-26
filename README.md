# Project-GrubDash-Backend

## Description

- This is an API project following **RESTful design principles** for a Grub-Dash-Front-End found [here](https://github.com/ramamdeeCode/grub-dash-front-end.git)

[Live Project Back-end](https://project-grubdash-backend.onrender.com/dishes)

![image](https://user-images.githubusercontent.com/86864383/183989221-3499e80c-8ada-447d-93a9-c99f148b48dd.png)

## Functionalities

This server work with two resources Dishes and Orders

| Dishes              | Routes              |
| ------------------- | ------------------- |
| Create new Dish     | POST /dishes        |
| Update new Dish     | PUT /dishes/:dishId |
| Find Dish by id     | GET /dishes/:dishId |
| List all the Dishes | GET /dishes         |

| Orders              | Routes                  |
| ------------------- | ----------------------- |
| Create new Order    | POST /orders            |
| Update new Order    | PUT /orders/:orderId    |
| Find Order by id    | GET /orders/:orderId    |
| Delete Order        | Delete /orders/:orderId |
| List all the dishes | POST /orders            |
