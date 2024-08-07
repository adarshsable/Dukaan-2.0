import { useMemo } from "react";
import { useParams } from "react-router-dom";
// components
import Return from "@/components/return";
import PurchaseTable from "./PurchaseTable";
import BasicTab from "@/components/common/BasicTab";
import PartyOverview from "../(components)/PartyOverview";
import PaymentTable from "@/components/cards/PaymentTable";
import PendingPaymentTable from "@/components/pendingPayment";
import BasicDateRangePicker from "@/components/fields/DateRangePicker";
// hooks
import { PartyDetailsReponse, usePartyDetails } from "@/hooks/usePartyDetails";

const tabsData = [
  {
    label: "Overview",
    value: "Overview",
    content: PartyOverview,
  },
  {
    label: "Purchase Record",
    value: "Purchase Record",
    content: PurchaseTable,
  },
  {
    label: "Pending Payment Record",
    value: "Pending Payment Record",
    content: PendingPaymentTable,
  },
  {
    label: "Payment Record",
    value: "Payment Record",
    content: PaymentTable,
  },
  {
    label: "Return Record",
    value: "Return Record",
    content: Return,
  },
];

const PartyDetails = () => {
  const { id: partyId } = useParams();
  const { data: partiesData = [], isLoading } = usePartyDetails();

  const partyDetails = useMemo(() => {
    return (
      partiesData?.find((item) => item.id === partyId) ||
      ({} as PartyDetailsReponse)
    );
  }, [partiesData]);

  const data = { partyId: partyId };

  /**
   * ======================= LOADING & ERROR =====================
   */

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex justify-center items-center ">
        <div className="bg-white rounded-sm shadow-md px-6 py-4 text-mediumDark text-2xl">
          Fetching party details....
        </div>
      </div>
    );
  }

  if (Object.keys(partyDetails).length === 0) {
    return (
      <div className="h-[60vh] w-full flex justify-center items-center ">
        <div className="bg-white rounded-sm shadow-md px-6 py-4 text-mediumDark text-2xl">
          Party Not Found
        </div>
      </div>
    );
  }

  /**
   * TSX
   */
  return (
    <div className="relative w-[90%] mx-auto mt-10">
      <div className="flex justify-between items-center gap-2 bg-lightDark py-4 px-6 rounded-md">
        <div className="flex gap-6">
          <div className="text-white text-2xl capitalize font-[550]">
            owner : <span className="font-normal">{partyDetails.name}</span>
          </div>
          <div className="text-white text-2xl capitalize font-[550]">
            Shop : <span className="font-normal">{partyDetails.shopName}</span>
          </div>
          <div className="text-white text-2xl capitalize font-[550]">
            Contact :{" "}
            <span className="font-normal">{partyDetails.contact}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <BasicDateRangePicker />
      </div>

      <div className="mt-4">
        <BasicTab tabData={tabsData} data={data} />
      </div>
      <br />
      <br />
    </div>
  );
};

export default PartyDetails;
