import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <h1 className="text-2xl text-yellow-600">Hello world</h1>
        <button className="btn">Button</button>
        Signed in as {session?.user?.email || ""} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        onClick={async () => {
          const user = await signIn("google");
          console.log(user);
        }}
      >
        Sign in
      </button>
    </>
  );
}
