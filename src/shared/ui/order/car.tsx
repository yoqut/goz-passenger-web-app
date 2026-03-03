interface IOrderCarProps {
  name?: string;
  number?: string;
  color?: string;
}

export const OrderCar = ({ name, number, color }: IOrderCarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <p className="text-md font-medium leading-6 text-gray-900">{name}</p>
        <p className="text-sm font-normal leading-6 text-gray-900">({color})</p>
      </div>
      <p className="text-sm font-normal border border-gray-300 text-gray-900 px-2 py-1 rounded-full">
        {number}
      </p>
    </div>
  );
};
