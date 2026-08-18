const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(422).json({ error: "Name is required" });
    }
    if (!req.body.email) {
      return res.status(422).json({ error: "Email is required" });
    }
    if (!req.body.phone) {
      return res.status(422).json({ error: "Phone is required" });
    }
    if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
      return res.status(409).json({ error: "User is already exist" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: hashedPassword,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.email) {
      return res.status(409).json({ error: "Email Cant be updated" });
    }
    if (
      !(await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
      }))
    ) {
      return res.status(422).json({ error: "User id not found" });
    }
    if (req.body.name !== undefined && req.body.name.trim() === "") {
      return res.status(422).json({ error: "Name cannot be empty" });
    }
    if (req.body.phone !== undefined && req.body.phone.trim() === "") {
      return res.status(422).json({ error: "Phone cannot be empty" });
    }
    if (req.body.address !== undefined && req.body.address.trim() === "") {
      return res.status(422).json({ error: "Address cannot be empty" });
    }
    const updatedUser = await prisma.user.update({
      data: req.body,
      where: {
        id: parseInt(req.params.id),
      },
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    if (
      !(await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
      }))
    ) {
      return res.status(422).json({ error: "User id not found" });
    }
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    if (
      !(await prisma.user.findUnique({
        where: { email: req.body.email },
      }))
    ) {
      return res.status(422).json({ error: "User not found, sign up" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    return res.status(200).json({ user: user, token: token });
  } catch (error) {}
};
