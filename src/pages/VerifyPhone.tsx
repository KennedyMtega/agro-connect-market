import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

const VerifyPhone = () => {
  const navigate = useNavigate();
  const { user, verifyPhone } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Redirect if no user or phone is already verified
  if (!user || (user && user.isPhoneVerified)) {
    navigate("/");
    return null;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (user && user.phoneNumber) {
        await verifyPhone(user.phoneNumber, otp);
        navigate("/");
      } else {
        throw new Error("Phone number not found");
      }
    } catch (err) {
      setError("Invalid OTP or verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);

    try {
      // Mock resending OTP - would be replaced with actual API call
      setTimeout(() => {
        setIsResending(false);
      }, 1500);
    } catch (err) {
      setError("Failed to resend OTP");
      setIsResending(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify Your Phone</CardTitle>
            <CardDescription className="text-center">
              Enter the OTP code sent to {user?.phoneNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Phone"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOtp}
                className="text-primary hover:underline"
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyPhone;
