import Stock from "../models/stock.model.js";

export const updateStockQuantity = async (
  product_id,
  quantityChange,
  transaction
) => {
  try {
    const quantity_change_num = parseInt(quantityChange);

    // Find or create the stock entry
    let stock = await Stock.findOne({ where: { product_id } });
    if (!stock) {
      stock = await Stock.create({ product_id, quantity: 0 }, { transaction });
    }

    // Update stock quantity based on quantityChange
    if (quantity_change_num >= 0) {
      // Adding stock
      stock.quantity += quantity_change_num;
    } else {
      // Subtracting stock
      const quantity_to_subtract = Math.abs(quantity_change_num);
      if (stock.quantity < quantity_to_subtract) {
        throw new Error("Insufficient stock to subtract");
      }
      stock.quantity -= quantity_to_subtract;
    }

    // Save the updated stock
    await stock.save();
    return stock;
  } catch (error) {
    throw new Error("Error updating stock quantity: " + error.message);
  }
};
