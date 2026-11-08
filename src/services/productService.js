
import { supabase } from "./supabase";

// Obtener todos los artículos
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Registrar un nuevo artículo
export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      quantity: product.quantity,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProduct(productId, productData) {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: productData.name,
      quantity: productData.quantity,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteProduct(productId) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw error;
  }
}