import { NextResponse } from "next/server";

const BEHOLD_FEED_URL = "https://feeds.behold.so/Gv7lKCurlLLb1jrUEL4w";

export type InstagramPost = {
  id: string;
  permalink: string;
  mediaType: string;
  imageUrl: string;
  caption: string;
};

export async function GET() {
  try {
    const res = await fetch(BEHOLD_FEED_URL, {
      // Cache for 1 hour, revalidate in background
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ posts: [] }, { status: 200 });
    }

    const data = await res.json();

    const posts: InstagramPost[] = (data.posts ?? [])
      .slice(0, 3)
      .map((post: Record<string, unknown>) => {
        const sizes = post.sizes as Record<string, { mediaUrl: string }> | undefined;
        const imageUrl =
          sizes?.medium?.mediaUrl ??
          sizes?.small?.mediaUrl ??
          (post.mediaUrl as string) ??
          "";
        return {
          id: post.id as string,
          permalink: post.permalink as string,
          mediaType: post.mediaType as string,
          imageUrl,
          caption: (post.prunedCaption as string) ?? (post.caption as string) ?? "",
        };
      })
      .filter((p: InstagramPost) => p.imageUrl);

    return NextResponse.json({ posts, username: data.username ?? "ekirei_219" });
  } catch {
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
