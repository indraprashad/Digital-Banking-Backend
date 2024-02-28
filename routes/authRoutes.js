const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { jwtkey } = require("../key");
const requireToken = require("../middleware/requireToken");
const router = express.Router();
const User = mongoose.model("User");
const ImageModel = require("../models/Image");
const Recharge = require("../models/Recharge");
const Transfer = require("../models/Transfer");
const Account = require("../models/Account");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) throw new Error("User exists!");

    // Generate the new ID for the user
    const lastUser = await User.findOne().sort({ _id: -1 });
    let userId;
    if (lastUser) {
      const lastUserId = parseInt(lastUser._id.split("51001")[1]);
      userId = `51001${(lastUserId + 1).toString().padStart(4, "0")}`;
    } else {
      userId = "510011111";
    }
    const user = new User({
      _id: userId,
      username,
      email,
      password,
      confirmPassword,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, jwtkey);
    res.send({ token, ...userResponse(user) });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "must provide email or password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(422)
      .send({ error: "must provide username and password" });
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, jwtkey);
    res.send({ token, ...userResponse(user) });
  } catch (err) {
    return res.status(422).send({ error: "must provide email" });
  }
});

router.get("/username", requireToken, async (req, res) => {
  const { user } = req;
  try {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userResponse(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const lastImage = await ImageModel.findOne().sort({ _id: -1 });
    let imageId;
    if (lastImage) {
      const lastImageId = parseInt(lastImage._id.split("111")[1]);
      imageId = `111${(lastImageId + 1).toString().padStart(3, "0")}`;
    } else {
      imageId = "111001";
    }

    const newImage = new ImageModel({
      _id: imageId,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      image: req.file.buffer,
    });

    await newImage.save();
    res.status(201).send("Image uploaded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
router.get("/images/:_id", async (req, res) => {
  const { _id } = req.params;
  const image = await Image.findOne({ _id });
  if (!image) {
    return res
      .status(404)
      .json({ success: false, message: "Image not found." });
  }
  res.set("Content-Type", image.contentType);
  res.send(image.image);
});

router.post('/recharge', async (req, res) => {
  try {
    const { selectedSim, phoneNumber, amount } = req.body;
    const recharge = new Recharge({ selectedSim, phoneNumber, amount });
    await recharge.save();
    res.status(201).json({ message: 'Recharge successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

router.post('/transfer', async (req, res) => { 
  try {
    const { sender, recipient, amount } = req.body;
    const transfer = new Transfer({ sender, recipient, amount });
    await transfer.save();
    console.log(`Transfer ${amount} from ${sender} to ${recipient}`);
    res.status(200).send('Transfer successful');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/transfer', async (req, res) => {
  try {
    // Retrieve all transfer data from the database
    const transfers = await Transfer.find({}, 'amount');

    // Send the transfer data as a response
    res.status(200).json(transfers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/balance', async (req, res) => {
  const { senderAccountId, recipientAccountId, amount } = req.body;

  try {
    const senderAccount = await Account.findOne({ _id: senderAccountId });
    const recipientAccount = await Account.findOne({ _id: recipientAccountId });

    if (!senderAccount || !recipientAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (senderAccount.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    senderAccount.balance -= amount;
    recipientAccount.balance += amount;

    await senderAccount.save();
    await recipientAccount.save();

    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});


function userResponse(user) {
  return { ...user.toJSON(), password: undefined, confirmPassword: undefined };
}




module.exports = router;
