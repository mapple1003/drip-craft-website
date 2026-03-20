import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const contactSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容が正しくありません" }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  // Save to Firestore
  try {
    await addDoc(collection(db, "contacts"), {
      name,
      email,
      message,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch {
    return NextResponse.json({ error: "データの保存に失敗しました" }, { status: 500 });
  }

  // Send email notification
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "EKIREI お問い合わせ <onboarding@resend.dev>",
        to: "ekirei.26219@gmail.com",
        subject: `【EKIREI】${name} 様からお問い合わせが届きました`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #539d84;">【EKIREI】お問い合わせが届きました</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border: 1px solid #eee; background: #f9f9f9; width: 120px; font-weight: bold;">お名前</td>
                <td style="padding: 8px; border: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #eee; background: #f9f9f9; font-weight: bold;">メール</td>
                <td style="padding: 8px; border: 1px solid #eee;">
                  <a href="mailto:${email}">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #eee; background: #f9f9f9; font-weight: bold;">メッセージ</td>
                <td style="padding: 8px; border: 1px solid #eee; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
            <p style="color: #888; font-size: 12px; margin-top: 24px;">
              このメールは EKIREI ホームページのお問い合わせフォームから自動送信されました。
            </p>
          </div>
        `,
      });
    } catch {
      // Email sending failure should not block the user's submission
      console.error("メール送信に失敗しました");
    }
  }

  return NextResponse.json({ success: true });
}
