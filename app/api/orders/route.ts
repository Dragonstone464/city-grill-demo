
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_phone,
      order_type,
      delivery_address,
      total,
      items,
    } = body;

    if (
      !customer_name ||
      !customer_phone ||
      !["pickup", "delivery"].includes(order_type) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !Number.isFinite(Number(total)) ||
      Number(total) <= 0
    ) {
      return NextResponse.json(
        { error: "Ungültige Bestelldaten" },
        { status: 400 }
      );
    }

    if (order_type === "delivery" && !delivery_address) {
      return NextResponse.json(
        { error: "Lieferadresse fehlt" },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_phone,
        order_type,
        delivery_address: delivery_address || null,
        status: "new",
        total: Number(total),
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_name: String(item.name),
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      throw itemsError;
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
    });
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      { error: "Bestellung konnte nicht gespeichert werden" },
      { status: 500 }
    );
  }
}
