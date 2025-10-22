import { Profile } from "../../../components/Profile";
import { getSession } from "@/app/lib/auth/auth";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.safeUser || null;

  return <Profile user={user} />;
}
