import { BsBoxes } from "react-icons/bs";
import { GrMoney } from "react-icons/gr";
import { BiCategoryAlt } from "react-icons/bi";
import RecordBox from "../../../components/RecordBox";
function ProductReports() {
  return (
    <div className="grid grid-rows-3 w-full gap-1 justify-center items-center h-full grid-cols-1">
      <RecordBox label="Total Product" value="200" Icon={BsBoxes} />
      <RecordBox label="Total Product Worth" value="₱ 200.9" Icon={GrMoney} />
      <RecordBox
        label="Total Product Categories"
        value="3"
        Icon={BiCategoryAlt}
      />
    </div>
  );
}

export default ProductReports;
