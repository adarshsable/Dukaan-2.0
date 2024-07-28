import { fn, col, literal } from "sequelize";
import { DateCondition } from "../utils/date.js";
import PendingPayment from "../models/pendingPayment.model.js";

export async function PurchaseToPendingPayment(req, transaction) {
  try {
    const { order_id = "", party_id, price } = req;
    const price_num = parseInt(price);

    // Check if the order already exists
    const existingPayment = await PendingPayment.findOne({
      where: { order_id },
      transaction,
    });

    if (existingPayment) {
      // Update the existing order's total_amount
      existingPayment.total_amount += price_num;
      const addPayment = await existingPayment.save({ transaction });

      if (!addPayment)
        return {
          data: "Error while adding payment in pending payment",
          isError: true,
        };

      return { data: order_id, isError: false };
    } else {
      // Create a new PendingPayment entry
      const paymentCreated = await PendingPayment.create(
        {
          party_id,
          total_amount: price_num,
        },
        { transaction }
      );

      if (!paymentCreated)
        return { data: "Error while creating pending payment!", isError: true };

      return { data: paymentCreated.order_id, isError: false };
    }
  } catch (error) {
    return { data: error, isError: true };
  }
}

export async function DeletePurchaseFromPendingPayment(req, transaction) {
  try {
    const { order_id = "", price } = req;
    const price_num = parseInt(price);

    // Check if the order already exists
    const existingPayment = await PendingPayment.findOne({
      where: { order_id },
      transaction,
    });

    if (!existingPayment)
      return { data: "Order id not found in pending payment", error: true };

    // ! add a case for if user tries to delete purchase record and its payment is already done

    // Update the existing order's total_amount
    existingPayment.total_amount -= price_num;
    const paymentUpdated = await existingPayment.save({ transaction });

    if (!paymentUpdated)
      return { data: "Error while updating pending payment", isError: true };
    return { data: order_id, isError: false };
  } catch (error) {
    return { data: error, isError: true };
  }
}

export async function GetPartyPendingPaymentDetails(req, res) {
  try {
    const { party_id, startDate, endDate } = req.query;

    if (!party_id) return res.status(400).json("Missing party_id parameter");
    if (!startDate) return res.status(400).json("Missing start date parameter");
    if (!endDate) return res.status(400).json("Missing end date parameter");

    const dateCondition = DateCondition({
      ...req.query,
      date_label: "createdAt",
    });

    // Fetch purchase data based on party_id
    const pendingPaymentData = await PendingPayment.findAll({
      where: {
        party_id: party_id,
        ...dateCondition,
      },
      order: [
        ["createdAt", "DESC"],
        ["order_id", "ASC"],
      ],
    });

    // Query to get the total purchase amount and total pending payment
    const totals = await PendingPayment.findAll({
      where: {
        party_id: party_id,
        ...dateCondition,
      },
      attributes: [
        [fn("SUM", col("total_amount")), "totalPurchase"],
        [
          fn("SUM", literal("total_amount - paid_amount")),
          "totalPendingPayment",
        ],
      ],
    });

    if (!pendingPaymentData)
      return res.json(404).json("Party pending payment not found!");

    const totalPurchase = totals[0]?.dataValues.totalPurchase || 0;
    const totalPendingPayment = totals[0]?.dataValues.totalPendingPayment || 0;

    return res
      .status(200)
      .json({ pendingPaymentData, totalPurchase, totalPendingPayment });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}

export async function UpdatePaidAmountDetails(req, transaction) {
  try {
    const { order_id = "", payment: amount } = req;

    // Check if the order already exists
    const existingPayment = await PendingPayment.findOne({
      where: { order_id },
      transaction,
    });

    if (!existingPayment)
      return { data: "Order id not found in pending payment", isError: true };

    const total_paid_amount = parseInt(amount) + existingPayment.paid_amount;

    if (existingPayment.total_amount >= total_paid_amount) {
      // Update the existing order's total_amount
      existingPayment.paid_amount = total_paid_amount;
      const paymentUpdated = await existingPayment.save({ transaction });

      if (!paymentUpdated)
        return {
          data: "Error while adding total payment in pending payment",
          isError: true,
        };

      return { data: order_id, isError: false };
    }

    return {
      data: "Payment cannot be greather than total amount",
      isError: true,
    };
  } catch (error) {
    return { data: error, isError: true };
  }
}

export async function DeletePaidAmountDetails(req, transaction) {
  try {
    const { order_id = "", payment: amount } = req;

    // Check if the order already exists
    const existingPayment = await PendingPayment.findOne({
      where: { order_id },
      transaction,
    });

    if (!existingPayment)
      return { data: "Order id not found in pending payment", isError: true };

    const total_paid_amount = existingPayment.paid_amount - parseInt(amount);

    if (total_paid_amount >= 0) {
      // Update the existing order's total_amount
      existingPayment.paid_amount = total_paid_amount;
      await existingPayment.save({ transaction });
      return { data: order_id, isError: false };
    }

    return {
      data: "Incorrect payment data",
      isError: true,
    };
  } catch (error) {
    return { data: error, isError: true };
  }
}
