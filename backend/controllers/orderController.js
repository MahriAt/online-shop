const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(422).json({ error: "UserId is required " });
    }
    if (
      !(await prisma.user.findUnique({
        where: { id: parseInt(req.body.userId) },
      }))
    ) {
      return res.status(409).json({ error: "User doesn't exist" });
    }
    if (
      await prisma.order.findFirst({
        where: { userId: parseInt(req.body.userId) } && { status: "pending" },
      })
    ) {
      return res
        .status(409)
        .json({ error: "Pending order detected, can't create new order" });
    }
    const newOrder = await prisma.order.create({
      data: {
        userId: parseInt(req.body.userId),
      },
    });
    const newOrderHistory = await prisma.orderHistory.create({
      data: {
        userId: parseInt(req.body.userId),
        orderId: newOrder.id,
      },
    });
    return res.status(201).json([newOrder, newOrderHistory]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.addProductInOrder = async (req, res) => {
  try {
    if (
      !(await prisma.order.findUnique({
        where: { id: parseInt(req.params.orderId) },
      }))
    ) {
      return res.status(422).json({ error: "Could not find order by id" });
    }
    if (
      !(await prisma.product.findUnique({
        where: { id: parseInt(req.body.productId) },
      }))
    ) {
      return res.status(404).json("Product not found");
    }
    if (req.body.productId === "") {
      return res.status(422).json({ error: "Product id can not be empty" });
    }
    if (req.body.quantity !== undefined && req.body.quantity === "") {
      return res.status(422).json({ error: "Quantity cannot be empty" });
    }
    const product = await prisma.product.findFirst({
      where: { id: parseInt(req.body.productId) },
      select: {
        price: true,
      },
    });
    const newOrderItem = await prisma.orderItem.create({
      data: {
        productId: parseInt(req.body.productId),
        orderId: parseInt(req.params.orderId),
        quantity: parseInt(req.body.quantity),
        price: product.price,
      },
    });
    return res.status(201).json(newOrderItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.removeProductInOrder = async (req, res) => {
  try {
    const product = await prisma.orderItem.findFirst({
      where: {
        productId: parseInt(req.body.productId),
        orderId: parseInt(req.params.orderId),
      },
    });
    if (!product) {
      return res.status(404).json({ error: "product is not found" });
    }
    const quantityToRemove = req.body.quantity
      ? Number(req.body.quantity)
      : product.quantity;

    if (quantityToRemove <= 0) {
      return res.status(422).json({
        error: "Quantity must be greater than 0",
      });
    }

    if (quantityToRemove >= product.quantity) {
      await prisma.orderItem.delete({
        where: {
          id: product.id,
        },
      });

      return res.status(204).send();
    }

    const updatedProduct = await prisma.orderItem.update({
      where: {
        id: product.id,
      },
      data: {
        quantity: product.quantity - quantityToRemove,
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (
      !(await prisma.order.findUnique({
        where: { id: parseInt(req.params.id) },
      }))
    ) {
      return res.status(422).json({ error: "Could not find order by id" });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          select: {
            quantity: true,
            price: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      omit: {
        createAt: true,
        updatedAt: true,
      },
    });
    const totalPrice = order.items.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
    return res.status(200).json({
      ...order,
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (
      !(await prisma.order.findUnique({
        where: { id: parseInt(req.params.id) },
      }))
    ) {
      return res.status(404).json({ error: "Could not find order by id" });
    }
    if (
      req.body.status !== "pending" &&
      req.body.status !== "confirmed" &&
      req.body.status !== "processing" &&
      req.body.status !== "shiped" &&
      req.body.status !== "delivered"
    ) {
      return res.status(422).json({
        error:
          "Status should be one of these [pending, confirmed, processing, shiped, delivered]",
      });
    }
    const newOrderStatus = await prisma.order.update({
      data: {
        status: req.body.status,
      },
      where: { id: parseInt(req.params.id) },
    });
    return res.status(200).json(newOrderStatus);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    if (
      !(await prisma.order.findUnique({
        where: { id: parseInt(req.params.id) },
      }))
    ) {
      return res.status(422).json({ error: "Order id not found" });
    }
    await prisma.order.delete({
      where: { id: parseInt(req.params.id) },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
