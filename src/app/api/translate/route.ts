import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  text: z.string().min(1).max(5000),
  targets: z.array(z.enum(["EN-US", "ZH", "KO"])),
});

async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      source_lang: "JA",
      target_lang: targetLang,
    }),
  });
  if (!res.ok) throw new Error(`DeepL error: ${res.status}`);
  const data = await res.json();
  return data.translations?.[0]?.text ?? "";
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "翻訳APIキーが設定されていません" }, { status: 500 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容が正しくありません" }, { status: 400 });
  }

  const { text, targets } = parsed.data;

  try {
    const results = await Promise.all(
      targets.map(async (lang) => {
        const translated = await translateText(text, lang, apiKey);
        return [lang, translated] as const;
      })
    );
    return NextResponse.json(Object.fromEntries(results));
  } catch {
    return NextResponse.json({ error: "翻訳に失敗しました" }, { status: 500 });
  }
}
