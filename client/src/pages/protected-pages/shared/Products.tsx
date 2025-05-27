import { MdOutlineManageSearch } from "react-icons/md";

import ProductList from "./components/product-page/ProductList";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import { PRODUCT_URL } from "../../../api/request-api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecordBox from "../components/RecordBox";
import { AiOutlineProduct } from "react-icons/ai";
import { PiMoneyLight } from "react-icons/pi";
import { LuShapes } from "react-icons/lu";
function Products() {
  const navigate = useNavigate();
  const axiosInterceptor = useAxiosInterceptor();
  const [hasNextProducts, setHasNextProducts] = useState(true);
  const { data } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInterceptor.get(
        `${PRODUCT_URL}/list?limit=10&page=${pageParam}`
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (getNextProducts) => {
      if (getNextProducts === null && hasNextProducts) {
        setHasNextProducts(false);
      } else {
        return getNextProducts;
      }
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full h-auto lg:h-full">
      <div className="grid gap-1.5 grid-cols-4 p-2 border border-zinc-200 rounded-sm">
        <RecordBox
          label="Total Number of Products"
          value="25"
          Icon={AiOutlineProduct}
        />
        <RecordBox
          label="Total Amount of Products"
          value="₱ 25.00"
          Icon={PiMoneyLight}
          className="col-span-2"
        />
        <RecordBox label="Total Categories" value="5" Icon={LuShapes} />
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex space-x-1.5 items-center w-full">
          <div className="flex-grow rounded-sm bg-zinc-200 secondary/15 border border-zinc-400/35 flex items-center justify-center px-1 py-2">
            <button type="button" className="px-1 text-secondary">
              <MdOutlineManageSearch />
            </button>
            <input
              type="text"
              className="text-sm bg-transparent flex-grow text-secondary w-full outline-0 px-1"
              placeholder="Search Product (@e g Product Name or Sku)"
            />
          </div>
          <button
            onClick={() => navigate("add-product")}
            className="bg-primary text-white py-2 px-5 text-[0.8rem] rounded-sm cursor-pointer"
          >
            Add Product
          </button>
        </div>
        <ProductList />
      </div>
    </div>
  );
}

export default Products;
