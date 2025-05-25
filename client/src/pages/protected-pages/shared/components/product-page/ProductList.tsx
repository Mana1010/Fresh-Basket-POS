import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import SelectBox from "../../../components/SelectBox";
import { AnimatePresence } from "framer-motion";

function ProductList() {
  const [openFilterProduct, setOpenFilterProduct] = useState(false);
  const [openFilterPrice, setOpenFilterPrice] = useState(false);
  return (
    <div className="flex flex-col gap-2 col-span-4">
      <div className="w-full">
        <table className="w-full h-full">
          <thead className="product-thead">
            <tr className="divide-x divide-zinc-300/60">
              <td className="relative">
                <div className="inline-block space-x-1">
                  <span>Product</span>
                  <button
                    onClick={() => setOpenFilterProduct((prev) => !prev)}
                    className={`p-2 ring ring-zinc-200/5 rounded-full cursor-pointer ${
                      openFilterProduct &&
                      "bg-secondary/25 transition-colors duration-150"
                    }`}
                  >
                    <FiFilter />
                  </button>
                  <AnimatePresence mode="wait">
                    {openFilterProduct && (
                      <SelectBox
                        mutate={() => {}}
                        setOpenFilterProduct={setOpenFilterProduct}
                        values={["asc", "desc"]}
                        options={[
                          "Sort Product Name (A-Z)",
                          "Sort Product Name (Z-A)",
                        ]}
                        currentValue={"asc"}
                        className="top-[85%] right-[-55px] absolute origin-top-left
                      "
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td> SKU</td>
              <td> Category</td>
              <td className="relative">
                <div className="inline-block space-x-1">
                  <span>Price</span>
                  <button
                    onClick={() => setOpenFilterPrice((prev) => !prev)}
                    className={`p-2 ring ring-zinc-200/5 rounded-full cursor-pointer ${
                      openFilterPrice &&
                      "bg-secondary/25 transition-colors duration-150"
                    }`}
                  >
                    <FiFilter />
                  </button>
                  <AnimatePresence mode="wait">
                    {openFilterPrice && (
                      <SelectBox
                        setOpenFilterProduct={setOpenFilterPrice}
                        mutate={() => {}}
                        values={["asc", "desc"]}
                        options={[
                          "Sort Product Price (Lowest to Highest)",
                          "Sort Product Price (Highest to Lowest)",
                        ]}
                        currentValue={"asc"}
                        className="top-[85%] right-[-55px] absolute origin-top-left
                      "
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td>Manufacturer</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody className="product-tbody">
            <tr>
              <td>Apple</td>
              <td>Apple-21-RED</td>
              <td>Age</td>
              <td>25.5</td>
              <td>Bulacan</td>
              <td>Bulacan</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;
