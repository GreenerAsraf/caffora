import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const amount = Number(body.amount || 0)

  if (!Number.isFinite(amount) || amount < 50) {
    return NextResponse.json({ success: false, message: "Order total must be at least $0.50." }, { status: 400 })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    const response = await fetch(`${apiUrl}/payment/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("authorization") ?? "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }).catch(() => null)

    if (response) {
      const payload = await response.json().catch(() => null)
      return NextResponse.json(payload, { status: response.status })
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      clientSecret: `pi_mock_${Date.now()}_secret_caffora`,
      amount,
    },
  })
}
