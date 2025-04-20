import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

const Register = () => {
  const navigate = useNavigate();
  const { register, registerWithPhone } = useAuth();
  
  // Email registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"buyer" | "seller">("buyer");
  
  // Phone registration
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullNamePhone, setFullNamePhone] = useState("");
  const [userTypePhone, setUserTypePhone] = useState<"buyer" | "seller">("buyer");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await register(email, password, fullName, userType);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock sending OTP - would be replaced with actual API call
      setTimeout(() => {
        setOtpSent(true);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError("Failed to send OTP");
      setIsLoading(false);
    }
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await registerWithPhone(phoneNumber, fullNamePhone, userTypePhone);
      navigate("/verify-phone");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Register as a buyer or seller to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>I want to register as a:</Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={(value) => setUserType(value as "buyer" | "seller")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer" className="cursor-pointer">Buyer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller" className="cursor-pointer">Seller</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullNamePhone">Full Name</Label>
                    <Input
                      id="fullNamePhone"
                      placeholder="Enter your full name"
                      value={fullNamePhone}
                      onChange={(e) => setFullNamePhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>I want to register as a:</Label>
                    <RadioGroup
                      value={userTypePhone}
                      onValueChange={(value) => setUserTypePhone(value as "buyer" | "seller")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer-phone" />
                        <Label htmlFor="buyer-phone" className="cursor-pointer">Buyer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="seller-phone" />
                        <Label htmlFor="seller-phone" className="cursor-pointer">Seller</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Register & Verify Phone"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
