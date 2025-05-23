import React, { useState } from "react";
import Categories from "./orderlist-page/Categories";
function OrderList() {
  const [search, setSearch] = useState("");
  return (
    <div className="h-full w-full lg:col-span-3 col-span-full flex flex-col row-span-2 lg:row-span-1">
      <h1 className="text-md">
        <span className="text-secondary poppins-extrabold">Your</span>{" "}
        <span className="text-primary poppins-extrabold">Orders</span>
      </h1>
      <Categories />
    </div>
  );
}

export default OrderList;
