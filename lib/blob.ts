import { get } from "@vercel/blob";

export async function getSignedBlobUrl(pathname: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN");
  }
  const { url } = await get(pathname, { token });
  return url;
}
