import { PiMapPinSimpleLineFill } from "react-icons/pi";
function Header() {
  return (
    <div className="flex items-center justify-between w-full py-3.5 px-2.5 relative bg-secondary border-b border-b-white/35">
      <div className="flex items-center space-x-0.5">
        <span className="text-white text-lg">
          <PiMapPinSimpleLineFill />
        </span>
        <h1 className="text-orange-300 poppins-bold text-sm">Checkout</h1>
      </div>
      <div className="w-1/4 bg-secondary absolute inset-y-0.5 right-0.5 rounded-lg"></div>
    </div>
  );
}

export default Header;
