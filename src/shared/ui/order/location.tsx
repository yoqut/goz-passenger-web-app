interface ILocationProps {
  from?: string;
  to?: string;
}

export const Location = ({ from, to }: ILocationProps) => {
  return (
    <div className="space-y-3 relative">
      <div className="absolute top-1/2 -translate-y-1/2 left-2  h-4 border border-dashed border-blue-500" />
      <div className="flex items-center gap-2">
        <div className="p-1 block border border-blue-500 rounded-full">
          <div className="size-2 rounded-full bg-blue-500" />
        </div>
        <p className="text-md font-medium text-gray-900 capitalize">
          {from || "Ташкент, Юнусабадский район"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-1 border border-blue-500 rounded-full">
          <div className="size-2  rounded-full bg-blue-500" />
        </div>
        <p className="text-md font-medium text-gray-900 capitalize">
          {to || "Наманган"}
        </p>
      </div>
    </div>
  );
};
