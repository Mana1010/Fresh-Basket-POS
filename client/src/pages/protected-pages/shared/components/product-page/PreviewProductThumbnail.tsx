import emptyThumbnail from "../../../../../assets/stickers/empty-product-thumbnail.svg";
import { FaCircleXmark } from "react-icons/fa6";
import { CgArrowsExchange } from "react-icons/cg";

type PreviewProductThumbnailProps = {
  previewProductThumbnail: null | string;
  onClick: () => void;
};
function PreviewProductThumbnail({
  previewProductThumbnail,
  onClick,
}: PreviewProductThumbnailProps) {
  return (
    <>
      {previewProductThumbnail === null ? (
        <div className="border-dotted border-2 border-zinc-300 bg-zinc-100 w-[80%] h-[200px] flex flex-col items-center justify-center space-y-2">
          <img src={emptyThumbnail} height={60} width={60} />
          <div className="block">
            <h3 className="text-center text-zinc-400 text-[0.65rem]">
              Want to add a product thumbnail?{" "}
              <label
                htmlFor="upload-thumbnail"
                className="hover:text-primary underline-offset-2 underline decoration-zinc-400 hover:decoration-primary"
              >
                click here
              </label>
              .
            </h3>
            <h5 className="text-center text-zinc-400 text-[0.6rem]">
              ( .jpg, .png, .jpeg )
            </h5>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-2 items-center justify-center w-full">
          <div className="w-[60%] aspect-square relative bg-zinc-300 max-h-[230px] rounded-md flex items-center justify-center border border-zinc-300">
            <img
              src={previewProductThumbnail}
              alt="product-thumbnail"
              className="absolute inset-0 object-center w-full h-full object-cover rounded-md"
            />
            <button
              onClick={onClick}
              type="button"
              aria-label="Remove the attached Product Thumbnail"
              className="absolute -top-2 -right-2 text-2xl text-primary z-[99] bg-white rounded-full"
            >
              {" "}
              <FaCircleXmark />
            </button>
          </div>
          <label
            htmlFor="upload-thumbnail"
            className="text-slate-200 bg-secondary custom-border py-2 px-4 rounded-sm flex space-x-1"
          >
            <span className="text-lg">
              <CgArrowsExchange />
            </span>
            <span className=" text-[0.8rem]">Change Thumbnail</span>
          </label>
        </div>
      )}
    </>
  );
}

export default PreviewProductThumbnail;
