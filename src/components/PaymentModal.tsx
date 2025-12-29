import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  CreditCard,
  CheckCircle2,
  XCircle,
  IndianRupee,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/payment";
import { createPaymentOrder, verifyPayment } from "@/services/paymentService";
import { loadRazorpayScript } from "@/utils/razorpay";

interface PaymentModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentStep = "details" | "processing" | "success" | "failed";

const PaymentModal: React.FC<PaymentModalProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<PaymentStep>("details");
  const [paymentId, setPaymentId] = useState<string>("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
  });

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
  // Load Razorpay script on component mount
  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      setScriptLoaded(loaded);
      if (!loaded) {
        toast({
          title: "Script Load Error",
          description: "Failed to load Razorpay SDK. Please refresh the page.",
          variant: "destructive",
        });
      }
    };
    loadScript();
  }, [toast]);

  const paymentMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("No product selected");
      if (!scriptLoaded) throw new Error("Razorpay SDK not loaded");

      console.log("Starting payment process...");

      // Step 1: Create order on backend (simulated)
      const order = await createPaymentOrder(product.id, product.price);
      console.log("Order created:", order);

      // Step 2: Open Razorpay Checkout with payment options
      return new Promise<{
        razorpayPaymentId: string;
        razorpayOrderId: string;
        razorpaySignature: string;
      }>((resolve, reject) => {
        const options = {
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency,
          name: "TechStore",
          description: product.name,
          image: "https://layout.dev/assets/templates/layout.svg",
          order_id: order.id,
          handler: function (response: any) {
            console.log("Payment successful, response:", response);
            resolve({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.phone,
          },
          notes: {
            product_id: product.id,
            product_name: product.name,
          },
          theme: {
            color: "#3B82F6",
          },
          modal: {
            ondismiss: function () {
              console.log("Payment cancelled by user");
              reject(new Error("Payment cancelled by user"));
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response: any) {
          console.error("Payment failed:", response.error);
          reject(new Error(response.error.description || "Payment failed"));
        });

        rzp.open();
      });
    },
    onSuccess: async (data) => {
      console.log("Razorpay payment completed:", data);
      setStep("processing");

      try {
        // Step 3: Verify payment on backend
        const verificationResult = await verifyPayment(
          data.razorpayOrderId,
          data.razorpayPaymentId,
          data.razorpaySignature
        );

        console.log("Payment verified:", verificationResult);
        setPaymentId(data.razorpayPaymentId);
        setStep("success");

        toast({
          title: "Payment Successful!",
          description: verificationResult.message,
        });
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStep("failed");
        toast({
          title: "Verification Failed",
          description:
            "Payment completed but verification failed. Please contact support.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      console.error("Payment error:", error);
      setStep("failed");
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!scriptLoaded) {
      toast({
        title: "Loading Error",
        description: "Razorpay SDK is still loading. Please wait...",
        variant: "destructive",
      });
      return;
    }

    paymentMutation.mutate();
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("details");
      setPaymentId("");
      paymentMutation.reset();
    }, 300);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {step === "details" && "Complete Your Purchase"}
            {step === "processing" && "Verifying Payment..."}
            {step === "success" && "Payment Successful!"}
            {step === "failed" && "Payment Failed"}
          </DialogTitle>
          <DialogDescription>
            {step === "details" &&
              "Enter your details to proceed with Razorpay checkout"}
            {step === "processing" &&
              "Please wait while we verify your payment"}
            {step === "success" && "Your order has been confirmed"}
            {step === "failed" && "Something went wrong with your payment"}
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{product.name}</h4>
                  <div className="flex items-center gap-1 text-lg font-bold text-primary mt-1">
                    <IndianRupee className="h-4 w-4" />
                    <span>{product.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={userDetails.phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  maxLength={10}
                />
              </div>
            </div>

            <Button
              onClick={handlePayment}
              className="w-full"
              size="lg"
              disabled={!scriptLoaded || paymentMutation.isPending}
            >
              {paymentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Opening Razorpay...
                </>
              ) : (
                <>Pay with Razorpay ₹{product.price.toLocaleString("en-IN")}</>
              )}
            </Button>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                You will be redirected to Razorpay's secure payment gateway
              </p>
              <div className="flex items-center justify-center gap-2">
                <img
                  src="https://razorpay.com/assets/razorpay-glyph.svg"
                  alt="Razorpay"
                  className="h-4"
                />
                <span className="text-xs text-muted-foreground">
                  Secured by Razorpay
                </span>
              </div>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <p className="font-medium">Verifying your payment...</p>
              <p className="text-sm text-muted-foreground">
                This will only take a moment
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Payment ID: <span className="font-mono">{paymentId}</span>
              </p>
              <div className="bg-muted rounded-lg p-3 mt-4">
                <p className="text-sm font-medium mb-1">Order Details</p>
                <p className="text-sm text-muted-foreground">{product.name}</p>
                <p className="text-sm font-semibold text-primary mt-1">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                A confirmation email will be sent to {userDetails.email}
              </p>
            </div>
            <Button onClick={handleClose} className="w-full" size="lg">
              Continue Shopping
            </Button>
          </div>
        )}

        {step === "failed" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Payment Failed</h3>
              <p className="text-sm text-muted-foreground">
                We couldn't process your payment. Please try again.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                If the amount was deducted, it will be refunded within 5-7
                business days
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setStep("details");
                  paymentMutation.reset();
                }}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
