import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface VerificationStatusBannerProps {
  status: "pending" | "verified" | "rejected" | null;
  notes?: string | null;
}

export const VerificationStatusBanner = ({ status, notes }: VerificationStatusBannerProps) => {
  const navigate = useNavigate();

  if (!status) return null;

  const bannerConfig = {
    pending: {
      icon: Clock,
      variant: "default" as const,
      className: "border-yellow-500 bg-yellow-50 text-yellow-900",
      title: "Business Verification Pending",
      description: "Your business is under review. You'll be notified once approved. This usually takes 1-2 business days.",
    },
    verified: {
      icon: CheckCircle,
      variant: "default" as const,
      className: "border-green-500 bg-green-50 text-green-900",
      title: "Business Verified",
      description: "Congratulations! Your business is verified and visible to buyers. Start adding crops to your inventory.",
    },
    rejected: {
      icon: XCircle,
      variant: "destructive" as const,
      className: "border-red-500 bg-red-50 text-red-900",
      title: "Business Verification Rejected",
      description: notes || "Your business verification was rejected. Please update your information and try again.",
    },
  };

  const config = bannerConfig[status];
  const Icon = config.icon;

  return (
    <Alert className={`mb-6 ${config.className}`}>
      <Icon className="h-5 w-5" />
      <AlertTitle className="font-semibold">{config.title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{config.description}</span>
        {status === "rejected" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/seller-business-setup')}
            className="ml-4 shrink-0"
          >
            Update Business Info
          </Button>
        )}
        {status === "pending" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/seller-business-setup')}
            className="ml-4 shrink-0"
          >
            Edit Application
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
