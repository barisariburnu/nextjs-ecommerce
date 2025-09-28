import { Prisma, prisma } from "@repo/product-db";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  const data: Prisma.CategoryCreateInput = req.body;

  const category = await prisma.category.create({
    data,
  });
  res
    .status(201)
    .json({ message: "Category created successfully", data: category });
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID parameter
  if (!id) {
    return res
      .status(400)
      .json({ message: "Category ID is required", data: [] });
  }

  const categoryId = Number(id);
  if (isNaN(categoryId)) {
    return res
      .status(400)
      .json({ message: "Invalid category ID format", data: [] });
  }

  const data: Prisma.CategoryUpdateInput = req.body;
  const category = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });

  res
    .status(200)
    .json({ message: "Category updated successfully", data: category });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID parameter
  if (!id) {
    return res
      .status(400)
      .json({ message: "Category ID is required", data: [] });
  }

  const categoryId = Number(id);
  if (isNaN(categoryId)) {
    return res
      .status(400)
      .json({ message: "Invalid category ID format", data: [] });
  }

  const category = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  res
    .status(200)
    .json({ message: "Category deleted successfully", data: category });
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();

  res
    .status(200)
    .json({ message: "Categories fetched successfully", data: categories });
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID parameter
  if (!id) {
    return res
      .status(400)
      .json({ message: "Category ID is required", data: [] });
  }

  const categoryId = Number(id);
  if (isNaN(categoryId)) {
    return res
      .status(400)
      .json({ message: "Invalid category ID format", data: [] });
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found", data: [] });
  }

  res
    .status(200)
    .json({ message: "Category fetched successfully", data: category });
};
