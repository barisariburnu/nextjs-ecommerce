import { prisma, Prisma } from "@repo/product-db";
import type { StripeProductType } from "@repo/types";
import { Request, Response } from "express";
import { producer } from "../utils/kafka";

export const createProduct = async (req: Request, res: Response) => {
  const data: Prisma.ProductCreateInput = req.body;

  const { colors, images } = data;
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return res.status(400).json({ message: "Colors are required" });
  }

  if (!images || typeof images !== "object") {
    return res.status(400).json({ message: "Images are required" });
  }

  const missingColors = colors.filter((color) => !(color in images));

  if (missingColors.length > 0) {
    return res.status(400).json({
      message: `Images for colors ${missingColors.join(", ")} are required`,
      missingColors,
    });
  }

  const product = await prisma.product.create({
    data,
  });

  const stripeProduct: StripeProductType = {
    id: product.id.toString(),
    name: product.name,
    price: product.price,
  };

  producer.send<StripeProductType>("product.created", {
    value: stripeProduct,
  });

  res
    .status(201)
    .json({ message: "Product created successfully", data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID parameter
  if (!id) {
    return res
      .status(400)
      .json({ message: "Product ID is required", data: [] });
  }

  const productId = Number(id);
  if (isNaN(productId)) {
    return res
      .status(400)
      .json({ message: "Invalid product ID format", data: [] });
  }

  const data: Prisma.ProductUpdateInput = req.body;
  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data,
  });

  res
    .status(200)
    .json({ message: "Product updated successfully", data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID parameter
  if (!id) {
    return res
      .status(400)
      .json({ message: "Product ID is required", data: [] });
  }

  const productId = Number(id);
  if (isNaN(productId)) {
    return res
      .status(400)
      .json({ message: "Invalid product ID format", data: [] });
  }

  try {
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    producer.send<number>("product.deleted", {
      value: Number(id),
    });

    res
      .status(200)
      .json({ message: "Product deleted successfully", data: product });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Product not found", data: [] });
    }
    throw error;
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const { sort, category, search, limit } = req.query;

  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return {
          price: Prisma.SortOrder.asc,
        };
      case "desc":
        return {
          price: Prisma.SortOrder.desc,
        };
      case "oldest":
        return {
          createdAt: Prisma.SortOrder.asc,
        };
      default:
        return {
          createdAt: Prisma.SortOrder.desc,
        };
    }
  })();

  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category as string,
      },
      name: {
        contains: search as string,
        mode: "insensitive",
      },
    },
    orderBy,
    take: limit ? Number(limit) : 10,
  });

  res
    .status(200)
    .json({ message: "Products fetched successfully", data: products });
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID parameter
  if (!id) {
    return res
      .status(400)
      .json({ message: "Product ID is required", data: [] });
  }

  const productId = Number(id);
  if (isNaN(productId)) {
    return res
      .status(400)
      .json({ message: "Invalid product ID format", data: [] });
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found", data: [] });
  }

  res.json({ message: "Product fetched successfully", data: product });
};
