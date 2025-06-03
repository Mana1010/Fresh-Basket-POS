import { useEffect, useState } from "react";
import SelectBox from "../../../components/SelectBox";
import { AnimatePresence } from "framer-motion";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ACCOUNT_URL } from "../../../../../api/request-api";
import useAxiosInterceptor from "../../../../../hooks/useAxiosInterceptor";
import { useInView } from "react-intersection-observer";

import { LuList } from "react-icons/lu";
import { useModalStore } from "../../../../../store/modal.store";
import { IoEye, IoEyeOff } from "react-icons/io5";
import type { FullUserType } from "../../../../../types/user.types";
import { capitalizeFirstLetter } from "../../../../../utils/capitalize-first-letter";

type ProductListProps = {
  debouncedSearchedProduct: string;
};
function AccountList({ debouncedSearchedProduct }: ProductListProps) {
  const [openSortEmployee, setOpenSortEmployee] = useState(false);
  const [selectedToShowPasscode, setSelectedToShowPasscode] = useState<
    number | null
  >(null);
  const { toggleAccountDetails, setAccountDetails } = useModalStore();
  const { ref, inView } = useInView();
  const axiosInterceptor = useAxiosInterceptor();

  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["products", debouncedSearchedProduct],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axiosInterceptor.get(
          `${ACCOUNT_URL}/list?limit=10&page=${pageParam}&search=${""}`
        );
        return response.data.accounts;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        // Only return the next page number, not the entire response
        // Check if there's more data based on your API response structure
        if (lastPage.from === null || lastPage.data.length === 0) {
          return undefined; // No more pages
        }
        // Return the next page number
        return lastPage.current_page + 1;
      },
      staleTime: 30 * 1000,
    });

  // Get all products from all pages
  const allAccounts =
    data?.pages.flatMap((page) => page.data) || ([] as FullUserType[]);

  // Auto-fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex-grow w-auto lg:w-full h-auto lg:h-1 overflow-x-auto">
      <div className="w-full h-full overflow-y-auto thin-scrollbar pr-1">
        <table className="w-full">
          <thead className="product-thead">
            <tr>
              <td className="relative">
                <div className="flex items-center justify-center space-x-1">
                  <span>Employee Name</span>
                  <button
                    onClick={() => setOpenSortEmployee((prev) => !prev)}
                    className={`p-2 ring ring-zinc-200/5 rounded-full cursor-pointer text-lg ${
                      openSortEmployee &&
                      "bg-secondary/15 transition-colors duration-150"
                    }`}
                  >
                    <CgArrowsExchangeAltV />
                  </button>
                  <AnimatePresence mode="wait">
                    {openSortEmployee && (
                      <SelectBox
                        mutate={() => {}}
                        setOpenFilterProduct={setOpenSortEmployee}
                        values={["asc", "desc"]}
                        options={[
                          "Sort Employee Name (A-Z)",
                          "Sort Employee Name (Z-A)",
                        ]}
                        currentValue={"asc"}
                        className="top-[85%] right-[-55px] absolute origin-top-left"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </td>
              <td>Username</td>
              <td>Passcode</td>
              <td>Role</td>
              <td>Status</td>

              <td>Action</td>
            </tr>
          </thead>
          <tbody className="product-tbody">
            {allAccounts.map((account) => (
              <tr
                key={`${account.id}`} // Better key using product ID
                className={`border-b border-zinc-200 hover:bg-secondary/85 group transition-opacity duration-75 ease-in-out `}
              >
                <td>{account.employer_name}</td>
                <td>{account.username}</td>
                <td className="flex items-center justify-center">
                  <div className="flex items-center space-x-1.5 justify-center">
                    <input
                      type={
                        selectedToShowPasscode === account.id
                          ? "text"
                          : "password"
                      }
                      value={account.passcode}
                      disabled
                      className="transparent text-[0.75rem] text-secondary w-[100px] outline-none group-hover:text-zinc-100"
                    />
                    <button
                      onClick={() =>
                        setSelectedToShowPasscode((data) => {
                          return data === account.id ? null : account.id;
                        })
                      }
                      type="button"
                      className="text-secondary text-sm group-hover:text-zinc-100"
                    >
                      {selectedToShowPasscode === account.id ? (
                        <IoEyeOff />
                      ) : (
                        <IoEye />
                      )}
                    </button>
                  </div>
                </td>
                <td>{capitalizeFirstLetter(account.role)}</td>

                <td>
                  <span className="px-3 py-0.5 bg-orange-300/35 border border-orange-400 rounded-3xl">
                    {account.status}
                  </span>
                </td>
                <td className="flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccountDetails(account);
                      toggleAccountDetails();
                    }}
                    className="bg-secondary/90 cursor-pointer py-1.5 px-3 rounded-sm custom-border text-zinc-200 text-[0.7rem] flex space-x-1.5 items-center justify-center"
                  >
                    <span>
                      <LuList />
                    </span>
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading indicator */}
        {hasNextPage && (
          <div ref={ref} className="text-center py-4">
            {isFetchingNextPage ? "Loading more..." : "Load more data..."}
          </div>
        )}

        {/* End of results indicator */}
        {!hasNextPage && !isLoading && allAccounts.length > 5 && (
          <div className="text-center text-secondary text-[0.8rem] pt-2">
            End Result
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountList;
