
import { NextResponse } from "next/server";

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
      !order_type ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !Number.isFinite(Number(total)) ||
      Number(total) <= 0
    ) {
      return NextResponse.json(
        { error: "Ungültige Bestelldaten." },
        { status: 400 }
      );
    }

    if (
      items.some(
        (item: any) =>
          !item.product_name ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) <= 0 ||
          !Number.isFinite(Number(item.unit_price)) ||
          Number(item.unit_price) < 0
      )
    ) {
      return NextResponse.json(
        { error: "Ungültige Produktdaten." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      throw new Error("Supabase-Konfiguration fehlt.");
    }

    const headers = {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    };

    // Bestellung speichern
    const orderResponse = await fetch(
      `${supabaseUrl}/rest/v1/orders`,
      {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          customer_name,
          customer_phone,
          order_type,
          delivery_address: delivery_address || null,
          status: "new",
          total: Number(total),
        }),
        cache: "no-store",
      }
    );

    if (!orderResponse.ok) {
      throw new Error(await orderResponse.text());
    }

    const [order] = await orderResponse.json();

    // Produkte speichern
    const itemsResponse = await fetch(
      `${supabaseUrl}/rest/v1/order_items`,
      {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(
          items.map((item: any) => ({
            order_id: order.id,
            product_name: item.product_name,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
          }))
        ),
        cache: "no-store",
      }
    );

    if (!itemsResponse.ok) {
      // Unvollständige Bestellung entfernen
      await fetch(
        `${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`,
        {
          method: "DELETE",
          headers,
          cache: "no-store",
        }
      );

      throw new Error(await itemsResponse.text());
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      message: "Bestellung erfolgreich gespeichert.",
    });
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      { error: "Bestellung konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}
