"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { updatePizzaPrices } from "@/lib/admin-data";
import { pizzaExists } from "@/lib/data";
import { shouldFail, simulateLatency } from "@/lib/demo";
import { parsePrice } from "@/lib/format";
import type { PizzaSize } from "@/lib/types";

const SIZES: PizzaSize[] = ["S", "M", "L"];

export type PriceFormState = {
  errors: Partial<Record<PizzaSize | "form", string>>;
  // What the user typed, so the form can show it again after an error
  values: Record<PizzaSize, string>;
} | null;

export async function updatePricesAction(
  _prev: PriceFormState,
  formData: FormData,
): Promise<PriceFormState> {
  const id = formData.get("id");
  const values = {
    S: String(formData.get("S") ?? ""),
    M: String(formData.get("M") ?? ""),
    L: String(formData.get("L") ?? ""),
  };

  if (typeof id !== "string" || !(await pizzaExists(id))) {
    return { errors: { form: "Produk tidak dikenal." }, values };
  }

  const errors: NonNullable<PriceFormState>["errors"] = {};
  const prices = { S: 0, M: 0, L: 0 };
  for (const size of SIZES) {
    const price = parsePrice(values[size]);
    if (price === null) {
      errors[size] = "Masukkan angka 0.01–100, maksimal 2 desimal.";
    } else {
      prices[size] = price;
    }
  }
  if (Object.keys(errors).length === 0 && !(prices.S < prices.M && prices.M < prices.L)) {
    errors.form = "Harga harus naik sesuai ukuran: S < M < L.";
  }
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  await simulateLatency("write");
  if (await shouldFail()) {
    return { errors: { form: "Gagal menyimpan. Coba lagi." }, values };
  }

  await updatePizzaPrices(id, prices);
  // The shop's menu and detail pages are cached with cacheTag("menu"):
  // expire them now so customers see the new price on their next request
  updateTag("menu");
  redirect(`/admin/products?updated=${id}`);
}