import dayjs from "dayjs";

export const paymentModeOptions = [
  { label: "UPI", value: "UPI" },
  { label: "Cash", value: "Cash" },
  { label: "Account", value: "Account" },
];

export const formattedPendingPaymentTableColumns = (commonCols: any) => {
  if (commonCols.length === 0) return [];

  return commonCols?.map(
    ({ header, accessorkey }: { header: string; accessorkey: string }) => {
      return {
        header: header,
        id: accessorkey,
        accessorkey: accessorkey,
        accessorFn: (row: any) => row[accessorkey],
        Cell: ({ row }: { row: any }) => {
          const rowValue = row.original[accessorkey];

          if (accessorkey === "order_id")
            return (
              <p className="max-w-[7.5rem] overflow-hidden text-ellipsis whitespace-nowrap bg-gray-100 p-2 rounded">
                {rowValue}
              </p>
            );

          if (accessorkey === "total_amount" || accessorkey === "paid_amount")
            return `Rs ${rowValue}`;

          if (accessorkey === "createdAt") {
            const date = dayjs(rowValue).format("DD-MMM-YYYY");
            return date;
          }

          return rowValue;
        },
      };
    }
  );
};

export const formattedPartyPurchaseTableColumns = (commonCols: any) => {
  if (commonCols.length === 0) return [];

  return commonCols?.map(
    ({ header, accessorkey }: { header: string; accessorkey: string }) => {
      return {
        header: header,
        id: accessorkey,
        accessorkey: accessorkey,
        accessorFn: (row: any) => row[accessorkey],
        Cell: ({ row }: { row: any }) => {
          const rowValue = row.original[accessorkey];

          if (accessorkey === "price") return `Rs ${rowValue}`;

          if (accessorkey === "date") {
            const date = dayjs(rowValue).format("DD-MMM-YYYY");
            return date;
          }

          return rowValue;
        },
      };
    }
  );
};
