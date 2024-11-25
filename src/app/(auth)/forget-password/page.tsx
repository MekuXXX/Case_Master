import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgetPasswordForm from "@/components/authentication/ForgetPassword";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="container grid min-h-screen place-content-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full max-w-[30rem] flex-col justify-center space-y-6">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-2xl">
                Forgot password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a link to reset your
                password.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <ForgetPasswordForm />
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Back to login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
