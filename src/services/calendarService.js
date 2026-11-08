
import { supabase } from "./supabase";

// Obtener información del Calendario
export async function getCalendar() {
  const { data, error } = await supabase
    .from("calendar_inventory")
    .select("*")
    .eq("id", true)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Actualizar precio y cantidad del Calendario
export async function updateCalendar(calendarData) {
  const { data, error } = await supabase
    .from("calendar_inventory")
    .update({
      price: calendarData.price,
      quantity: calendarData.quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
