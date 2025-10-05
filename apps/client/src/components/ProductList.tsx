import { ProductType } from "@repo/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";

const fetchData = async ({
  category,
  sort,
  search,
  params,
}: {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;
  const paramsList: string[] = [];
  const categoryParam = category && category !== "all" ? `category=${category}` : "";
  if (categoryParam) paramsList.push(categoryParam);
  if (search) paramsList.push(`search=${search}`);
  paramsList.push(`sort=${sort ?? "newest"}`);
  if (params === "homepage") paramsList.push("limit=12", "offset=0");

  const url = `${baseUrl}/products?${paramsList.join("&")}`;
  const res = await fetch(url);
  const json = await res.json();
  const data: ProductType[] = json.data ?? json;
  return data as ProductType[];
};

const ProductList = async ({
  category,
  sort,
  search,
  params,
}: {
  category: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  const products = await fetchData({ category, sort, search, params });
  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter />}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link
        href={category ? `/products/?category=${category}` : "/products"}
        className="flex justify-end mt-4 underline text-sm text-gray-500"
      >
        View all products
      </Link>
    </div>
  );
};

export default ProductList;
