import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-center mt-16">
      <SignIn />
    </div>
  );
}
