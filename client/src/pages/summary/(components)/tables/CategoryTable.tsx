import BasicTable from "@/components/table/BasicTable";
import { getCategoryWiseOverview } from "@/services/Summary";
import { useGlobleStore } from "@/store/globalStore";
import { useQuery } from "@tanstack/react-query";

const cols = [
  { label: "Category", value: "category" },
  { label: "Total Purchase", value: "purchase" },
  { label: "Total Sold", value: "sold" },
  { label: "Quantity ( S / P )", value: "quantity" },
  { label: "Avg Price ( S / P )", value: "avg-price" },
  { label: "Profit", value: "profit" },
];

const CategoryTable = () => {
  const { selectedDateRange } = useGlobleStore();

  /**
   * ========================= API CALL ===========================
   */

  // Query to fetch all options data
  const { data: tableData = [] } = useQuery({
    queryKey: ["category-overview-table", selectedDateRange],
    queryFn: () => getCategoryWiseOverview(selectedDateRange),
  });

  /**
   * TSX
   */
  return (
    <div>
      <BasicTable cols={cols} rows={tableData || []} />
    </div>
  );
};

export default CategoryTable;
