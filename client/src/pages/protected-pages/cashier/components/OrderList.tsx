import React, { useState } from "react";
import Categories from "./orderlist-page/Categories";
function OrderList() {
  const [search, setSearch] = useState("");
  return (
    <div className="h-full w-full col-span-3 flex flex-col">
      <h1 className="text-md">
        <span className="text-secondary poppins-extrabold">Your</span>{" "}
        <span className="text-primary poppins-extrabold">Orders</span>
      </h1>
      <Categories />
    </div>
  );
}

export default OrderList;
