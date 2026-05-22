export const getProductImage = (product = {}) => {
  if (product.image_url || product.image) return product.image_url || product.image;

  const colorImages = product.color_images || product.colorImages || {};
  const firstColor = Object.keys(colorImages)[0];
  if (!firstColor) return '';

  const images = colorImages[firstColor] || {};
  return images.image1 || images.image2 || images.image3 || '';
};
