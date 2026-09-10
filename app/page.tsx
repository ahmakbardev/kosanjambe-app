import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Pintu masuk app: udah punya sesi → beranda, belum → layar masuk. Dicek di
 * sini juga, bukan cuma di middleware, biar yang udah login nggak mampir dulu
 * ke /masuk sebelum dilempar balik.
 */
export default async function Home() {
  const store = await cookies();
  redirect(store.has(SESSION_COOKIE) ? "/beranda" : "/masuk");
}
