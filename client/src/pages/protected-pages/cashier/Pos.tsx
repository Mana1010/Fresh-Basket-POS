import Invoice from "./components/Invoice";
import OrderList from "./components/OrderList";
import Transaction from "./components/Transaction";

function Pos() {
  return (
    <div className="w-full flex-grow grid-cols-4 gap-2 grid justify-center items-center p-2 h-full">
      <OrderList />
      <div className="flex flex-col w-full h-full gap-2 col-span-1">
        <Transaction />
        <Invoice />
      </div>
    </div>
  );
}

export default Pos;
