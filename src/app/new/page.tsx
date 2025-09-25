import CreateProject from "@/app/new/CreateProject";
import checkUser from "@/lib/checkUser";
import { usersCredits } from "@/lib/usersCredits";


export default async function New() {
  const user = await checkUser();
  const credits = await usersCredits();

  return (
    <CreateProject
      user={user ?? null}
      credits={credits}
    />
  );
}