import Invoice from "./components/Invoice";
import OrderList from "./components/OrderList";
import Transaction from "./components/Transaction";

function Pos() {
  return (
    <div className="w-full flex-grow lg:grid-cols-4 grid-cols-1 grid-rows-3 lg:grid-rows-1 gap-2 grid justify-center items-center p-2 h-full">
      <OrderList />
      <div className="flex lg:flex-col w-full h-full gap-2">
        <Transaction />
        <Invoice />
      </div>
    </div>
  );
}

export default Pos;
