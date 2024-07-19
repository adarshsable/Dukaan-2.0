import { FC } from "react";

type CardDataType = {
  name: string;
  label: string;
  id?: string | number;
  value: string | number;
};

interface ItemCardProps {
  data: CardDataType[];
  handleClick: (item: any) => void;
}

const ItemCard: FC<ItemCardProps> = ({ data = [], handleClick }) => {
  /**
   * TSX
   */
  return (
    <div className="w-full mt-6 grid grid-cols-12 gap-6">
      {data?.map((item: CardDataType, idx) => (
        <div
          key={idx}
          onClick={() => handleClick(item)}
          className="hover:scale-[1.02] ease-in-out duration-150 cursor-pointer col-span-3 bg-white shadow-md rounded-md py-8 px-6 text-mediumDark flex justify-between items-center"
        >
          <div className="flex flex-col gap-3">
            <div className="text-blue-400 text-2xl">{item?.name}</div>
            <div className="flex items-center gap-2">
              <div className="text-xl">{item?.label} </div>
              <div className="text-lg">{item?.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemCard;