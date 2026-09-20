export const toNumericShopifyId = (id) => id?.split("/").pop() || id;
