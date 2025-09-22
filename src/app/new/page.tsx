import CreateProject from "@/app/new/CreateProject";
import checkUser from "@/lib/checkUser";


export default async function New() {
  const user = await checkUser();

  return (
    <CreateProject
      user={user ?? null}
    />
  );
}