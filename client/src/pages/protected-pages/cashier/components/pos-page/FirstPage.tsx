import LastScannedItem from "./first-page/LastScannedItem";
import Transaction from "./first-page/Transaction";
import Invoice from "./first-page/Invoice";

function FirstPage() {
  return (
    <div className="flex lg:flex-col w-full h-full gap-2 px-2 border-l border-zinc-200">
      <LastScannedItem />
      <Transaction />
      <Invoice />
    </div>
  );
}

export default FirstPage;
