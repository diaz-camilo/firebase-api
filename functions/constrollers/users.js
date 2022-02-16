const functions = require("firebase-functions");
const express = require("express")
const cors = require("cors")

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const userApp = express();

userApp.use(cors({ origin: true }))

// Get all users
userApp.get("/", async (req, res) => {
  const snapshots = await db.collection("users").get();

  let users = [];
  snapshots.forEach(doc => {
    const id = doc.id;
    const data = doc.data();

    users.push({ id: id, ...data });
  });

  res.status(200).send(JSON.stringify(users));
});

// Get user by id
userApp.get("/:id", async (req, res) => {
  const snapshot = await db.collection("users").doc(req.params.id).get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send(JSON.stringify({ id: userId, ...userData }))
})

// Update User info (operation merges info)
userApp.put("/:id", async (req, res) => {
  // extract request body
  const body = req.body;
  // update store. pass a JSON object with the update
  await db.collection("users").doc(req.params.id).update(body)
  // return response
  res.status(200).send()
})

// Create user (if collection does not exist, it gets created)
userApp.post("/", async (req, res) => {
  const user = req.body;
  await db.collection("users").add(user);
  res.status(201).send();
});

// Deletes record
userApp.delete("/:id", async (req, res) => {
  await db.collection("users").doc(req.params.id).delete();
  res.status(200).send();
})

exports.user = functions.https.onRequest(userApp);



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });
