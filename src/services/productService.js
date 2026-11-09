
import { supabase } from "./supabase";

// Obtener artículos y sus variantes
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      variants:product_variants (
        id,
        color,
        quantity,
        created_at,
        updated_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Registrar un artículo con sus variantes
export async function createProduct(product) {
  const variants = product.variants;

  if (!variants || variants.length === 0) {
    throw new Error("El artículo debe tener al menos una variante.");
  }

  const totalQuantity = variants.reduce(
    (total, variant) => total + Number(variant.quantity),
    0
  );

  // Primero registramos el artículo
  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert({
      name: product.name,
      quantity: totalQuantity, // Compatibilidad temporal
    })
    .select()
    .single();

  if (productError) {
    throw productError;
  }

  // Después registramos sus variantes
  const variantsToInsert = variants.map((variant) => ({
    product_id: newProduct.id,
    color: variant.color.trim(),
    quantity: Number(variant.quantity),
  }));

  const { error: variantsError } = await supabase
    .from("product_variants")
    .insert(variantsToInsert);

  if (variantsError) {
    // Intentamos eliminar el artículo si falló el registro de variantes
    await supabase.from("products").delete().eq("id", newProduct.id);

    throw variantsError;
  }

  return newProduct;
}

// Actualizar un artículo y sus variantes
export async function updateProduct(productId, productData) {
  const variants = productData.variants;

  if (!variants || variants.length === 0) {
    throw new Error("El artículo debe tener al menos una variante.");
  }

  const totalQuantity = variants.reduce(
    (total, variant) => total + Number(variant.quantity),
    0
  );

  // Actualizamos el nombre y el stock temporal del artículo
  const { data: updatedProduct, error: productError } = await supabase
    .from("products")
    .update({
      name: productData.name,
      quantity: totalQuantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (productError) {
    throw productError;
  }

  // Consultamos las variantes existentes
  const { data: existingVariants, error: fetchError } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId);

  if (fetchError) {
    throw fetchError;
  }

  const existingIds = existingVariants.map((variant) => variant.id);
  const receivedIds = variants
    .filter((variant) => variant.id)
    .map((variant) => variant.id);

  // Actualizamos las variantes que ya existen
  for (const variant of variants.filter((item) => item.id)) {
    const { error } = await supabase
      .from("product_variants")
      .update({
        color: variant.color.trim(),
        quantity: Number(variant.quantity),
        updated_at: new Date().toISOString(),
      })
      .eq("id", variant.id)
      .eq("product_id", productId);

    if (error) {
      throw error;
    }
  }

  // Registramos las variantes nuevas
  const newVariants = variants
    .filter((variant) => !variant.id)
    .map((variant) => ({
      product_id: productId,
      color: variant.color.trim(),
      quantity: Number(variant.quantity),
    }));

  if (newVariants.length > 0) {
    const { error } = await supabase
      .from("product_variants")
      .insert(newVariants);

    if (error) {
      throw error;
    }
  }

  // Eliminamos las variantes que fueron retiradas del formulario
  const removedIds = existingIds.filter(
    (id) => !receivedIds.includes(id)
  );

  if (removedIds.length > 0) {
    const { error } = await supabase
      .from("product_variants")
      .delete()
      .in("id", removedIds)
      .eq("product_id", productId);

    if (error) {
      throw error;
    }
  }

  return updatedProduct;
}

// Eliminar un artículo
export async function deleteProduct(productId) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw error;
  }
}
