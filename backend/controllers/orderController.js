const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
  try {
    if (!req.user.userId) {
      return res.status(422).json({ error: "UserId is required " });
    }
    if (
      !(await prisma.user.findUnique({
        where: { id: parseInt(req.user.userId) },
      }))
    ) {
      return res.status(409).json({ error: "User doesn't exist" });
    }
    const pendingOrder = await prisma.order.findFirst({
      where: {
        userId: parseInt(req.user.userId),
        status: "pending",
      },
      include: {
        items: {
          orderBy: {
            id: "asc",
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (pendingOrder) {
      return res.status(200).json(pendingOrder);
    } else {
      const newOrder = await prisma.order.create({
        data: {
          userId: parseInt(req.user.userId),
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      });
      const newOrderHistory = await prisma.orderHistory.create({
        data: {
          userId: parseInt(req.user.userId),
          orderId: newOrder.id,
        },
      });
      return res.status(201).json(newOrder);
    }
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
    const userId = parseInt(req.user.userId);
    const productId = parseInt(req.body.productId);
    const quantity = parseInt(req.body.quantity);

    // Find the user's pending order
    const order = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: "pending",
      },
    });

    if (!order) {
      return res.status(404).json({
        error: "Pending order not found",
      });
    }

    if (
      !(await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      }))
    ) {
      return res.status(404).json("Product not found");
    }
    if (productId === "") {
      return res.status(422).json({ error: "Product id can not be empty" });
    }
    if (quantity !== undefined && quantity === "") {
      return res.status(422).json({ error: "Quantity cannot be empty" });
    }
    const product = await prisma.product.findFirst({
      where: { id: parseInt(productId) },
      select: {
        price: true,
      },
    });
    const productInCart = await prisma.orderItem.findFirst({
      where: { orderId: order.id, productId: parseInt(productId) },
    });
    if (productInCart) {
      const updatedOrder = await prisma.orderItem.update({
        where: { id: productInCart.id },
        data: {
          quantity: {
            increment: parseInt(quantity),
          },
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      });
      return res.status(200).json(updatedOrder);
    }
    const newOrderItem = await prisma.orderItem.create({
      data: {
        productId: parseInt(productId),
        orderId: parseInt(order.id),
        quantity: parseInt(quantity),
        price: product.price,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
    return res.status(201).json(newOrderItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.removeProductInOrder = async (req, res) => {
  try {
    const userId = parseInt(req.user.userId);
    const order = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: "pending",
      },
    });
    const product = await prisma.orderItem.findFirst({
      where: {
        productId: parseInt(req.body.productId),
        orderId: parseInt(order.id),
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
      include: {
        product: {
          include: {
            images: true,
          },
        },
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
                id: true,
                name: true,
                images: true,
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
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
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
