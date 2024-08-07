import { useMemo } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// components
import CommonTable from "@/components/table/CommonTable";
import PurchaseModal from "../(components)/PurchaseModal";
import ConfirmationModel from "@/components/model/ConfirmationModel";
// store
import { usePurchaseStore } from "@/store/purchaseStore";
import { useConfirmationStore } from "@/store/confirmationModelStore";
// services
import { deletePartyPuchaseDataApi } from "@/services/Purchase";
import { usePartyPurchaseData } from "../common/usePartyPurchaseData";
// data
import { commonCols } from "@/data/CommonTable";
import { formattedPurchaseTableColumns } from "../data/func";

const PurchaseTable = ({ partyId = "" }: { partyId: string }) => {
  const queryClient = useQueryClient();
  const { setIsModelOpen, setIsChecked } = usePurchaseStore();

  const { isConfirmationModelOpen, setIsConfirmationModelOpen, selectedData } =
    useConfirmationStore();

  /**
   * ========================= API CALL ===========================
   */

  // Query to fetch party purchase data
  const { purchases: partyPurchaseRowsData = [], isLoading } =
    usePartyPurchaseData({
      partyId,
    });

  // delete purchase data
  const { mutate: mutationDeletePartyPurchaseData } = useMutation({
    mutationFn: deletePartyPuchaseDataApi,
    onSuccess: () => {
      setIsConfirmationModelOpen();
      toast.success("Deleted successfully", { duration: 1200 });
      queryClient.invalidateQueries({
        queryKey: ["purchase-data", partyId],
      });
    },
    onError: (err: any) => {
      const message = err?.response?.data;
      toast.error(message || "Something went wrong", {
        duration: 3500,
      });
    },
  });

  /**
   * =========================== EVENT-HANDLER ==========================
   */

  // formatted columns data
  const formattedCols = useMemo(() => {
    return formattedPurchaseTableColumns(commonCols);
  }, [commonCols]);

  const handleDelete = ({ original }: { original: any }) => {
    const selectedData = { ...original, purchase_id: original.id };
    setIsConfirmationModelOpen(selectedData);
  };

  const handleClick = () => {
    setIsModelOpen();
    setIsChecked(false);
  };

  //

  /**
   * TSX
   */
  return (
    <div>
      <ConfirmationModel
        message="Are you sure you want to delete ?"
        handleConfirm={() => {
          mutationDeletePartyPurchaseData(selectedData);
        }}
        open={isConfirmationModelOpen}
        handleClose={setIsConfirmationModelOpen}
      />
      <PurchaseModal partyId={partyId} />
      <CommonTable
        enableEditing
        enableDelete
        openDeleteConfirmModal={handleDelete}
        isLoading={isLoading}
        topToolbarComp={
          <div>
            <button
              onClick={handleClick}
              className="hover:bg-indigo-500 cursor-pointer bg-indigo-400 py-2 px-3 text-white rounded-sm"
            >
              Add Purchase
            </button>
          </div>
        }
        columns={formattedCols}
        rows={partyPurchaseRowsData}
      />
    </div>
  );
};

export default PurchaseTable;
