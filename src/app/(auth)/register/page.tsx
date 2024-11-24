import { RegisterForm } from "@/components/authentication/RegisterForm";

type Props = {};

export default async function RegisterPage({}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
