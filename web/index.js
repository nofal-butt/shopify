// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import axios from "axios"

import mongoose from "mongoose";
import FormModel from "./dbSchema/Forms.js"
mongoose.connect("mongodb://0.0.0.0:27017/form",).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err)
});

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
//----------------------------------------------------starting point--------------
// const login = require("./dbSchema/form.js")

app.post("/api/login", async (req, res) => {
  console.log(req.body)
  console.log(res.locals.shopify.session)

  // const token = session.

  const { name, email, password } = req.body
  try {
    const data = new FormModel({
      name,
      email,
      password
    })
    console.log(data)
    await data.save()
  } catch (err) {
    res.status(400).json(console.log("this is error"))
  }

})
app.get("/api/login", async (req, res) => {
  const data = await FormModel.find()

  try {
    res.json(data)

  } catch (err) {
    res.status(400).json(console.log("this is error"))
  }

})
//----------------metafield api--------------



app.post("/api/metafield", async (req, res) => {
  const session = res.locals.shopify.session
  const { value } = req.body
  const id = req.params
  // console.log(session)
  // console.log(data)
  const token = session.accessToken
  // console.log(session.accessToken)
  const shop = session.shop
  // console.log(session.shop)
  const requestHeader = () => ({
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip,deflate,compress",
    "X-Shopify-Access-Token": token,
  });
  const newData = JSON.stringify({
    metafield: value
  })

  // await axios.get(`https://${shop}/admin/api/2023-04/products/${id}.json`, {
  await axios.post(`https://${shop}/admin/api/2023-04/products/${id}/metafields.json`, newData, {
    headers: requestHeader()
  }).then(function (response) {
    console.log(response.data);
    res.status(200).send({ data: response.data })
  }).catch(function (error) {
    console.error(error.message);
    res.status(500).send()
  });


})
// app.post("/api/metafield", async (req, res) => {
//   const data = req.body

//   console.log(data)
// })



//shopify apis for product


app.post("/api/product/post", async (req, res) => {
  const session = res.locals.shopify.session
  const { data } = req.body
  // const { id } = req.params
  // console.log(session)
  // console.log(data)
  const token = session.accessToken
  // console.log(session.accessToken)
  const shop = session.shop
  // console.log(session.shop)
  const requestHeader = () => ({
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip,deflate,compress",
    "X-Shopify-Access-Token": token,
  });
  const newData = JSON.stringify({
    product: data
  })

  // await axios.get(`https://${shop}/admin/api/2023-04/products/${id}.json`, {
  await axios.post(`https://${shop}/admin/api/2023-04/products.json`, newData, {
    headers: requestHeader()
  }).then(function (response) {
    console.log(response.data);
    res.status(200).send({ data: response.data })
  }).catch(function (error) {
    console.error(error.message);
    res.status(500).send()
  });


})

//  use for single id 
// app.get("/api/product/get/:id", async (req, res) => {
app.get("/api/product/get", async (req, res) => {
  const session = res.locals.shopify.session
  // const { id } = req.params
  const token = session.accessToken
  const shop = session.shop
  const requestHeader = () => ({
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip,deflate,compress",
    "X-Shopify-Access-Token": token,
  });


  // await axios.get(`https://${shop}/admin/api/2023-04/products/${id}.json`, {
  await axios.get(`https://${shop}/admin/api/2023-04/products.json`, {
    headers: requestHeader()
  }).then(function (response) {
    // console.log(response.data);
    res.status(200).send({ data: response.data })
  }).catch(function (error) {
    console.error(error.message);
    res.status(500).send()
  });


})

app.delete("/api/product/delete", async (req, res) => {
  const session = res.locals.shopify.session
  const { id } = req.body
  const token = session.accessToken
  const shop = session.shop
  const requestHeader = () => ({
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip,deflate,compress",
    "X-Shopify-Access-Token": token,
  });


  await axios.delete(`https://${shop}/admin/api/2023-04/products/${id}.json`, {
    // await axios.get(`https://${shop}/admin/api/2023-04/products.json`, {
    headers: requestHeader()
  }).then(function (response) {
    console.log(response.data);
    res.status(200).send({ data: response.data })
  }).catch(function (error) {
    console.error(error.message);
    res.status(500).send()
  });


})

app.put("/api/product/put", async (req, res) => {
  const session = res.locals.shopify.session
  const { data } = req.body
  console.log(data)
  const token = session.accessToken
  const shop = session.shop
  const requestHeader = () => ({
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip,deflate,compress",
    "X-Shopify-Access-Token": token,
  });
  const newData = JSON.stringify({
    product: {
      title: data?.title,
    }
  })


  await axios.put(`https://${shop}/admin/api/2023-04/products/${data?.id}.json`, newData, {
    // await axios.get(`https://${shop}/admin/api/2023-04/products.json`, {
    headers: requestHeader()
  }).then(function (response) {
    console.log(response.data);
    res.status(200).send({ data: response.data })
  }).catch(function (error) {
    console.error(error.message);
    res.status(500).send()
  });


})










//------------------------------------------end  point-------------------------------------------------------

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));
// console.log("Server is running")

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
