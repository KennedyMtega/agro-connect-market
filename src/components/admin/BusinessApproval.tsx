import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Check,
  X,
  Eye,
  FileText,
  MoreHorizontal,
  Building2,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SellerProfile } from "@/types/database";

interface SellerWithOwner extends SellerProfile {
  owner_name?: string;
  owner_email?: string;
}

export const BusinessApproval = () => {
  const [sellers, setSellers] = useState<SellerWithOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<SellerWithOwner | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setIsLoading(true);
      // Fetch seller profiles with owner info from profiles table
      const { data: sellerData, error: sellerError } = await supabase
        .from("seller_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (sellerError) throw sellerError;

      // Fetch owner profiles
      if (sellerData && sellerData.length > 0) {
        const userIds = sellerData.map(s => s.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        // Merge seller data with owner info
        const sellersWithOwners = sellerData.map(seller => {
          const ownerProfile = profilesData?.find(p => p.id === seller.user_id);
          return {
            ...seller,
            owner_name: ownerProfile?.full_name || "Unknown",
            owner_email: ownerProfile?.email || null,
          };
        });

        setSellers(sellersWithOwners);
      } else {
        setSellers([]);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch seller profiles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (sellerId: string, status: "verified" | "rejected") => {
    // Store previous state for optimistic update rollback
    const previousSellers = [...sellers];
    const previousNotes = reviewNotes;
    
    // Optimistic update
    setSellers(prev => prev.map(s => 
      s.id === sellerId ? { ...s, verification_status: status } : s
    ));
    setProcessingId(sellerId);
    
    try {
      const { error } = await supabase
        .from("seller_profiles")
        .update({ 
          verification_status: status,
          verification_notes: status === "rejected" ? reviewNotes : null
        })
        .eq("id", sellerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Business ${status === "verified" ? "approved" : "rejected"} successfully`,
      });

      setReviewNotes("");
    } catch (error) {
      console.error("Approval error:", error);
      // Rollback on error
      setSellers(previousSellers);
      toast({
        title: "Error",
        description: "Failed to update business status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredSellers = sellers.filter(seller => 
    activeTab === "all" || seller.verification_status === activeTab
  );

  const DocumentViewer = ({ url, type }: { url: string; type: string }) => (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{type}</span>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
      {url ? (
        <div className="bg-muted p-3 rounded text-sm">
          Document available for review
        </div>
      ) : (
        <div className="bg-red-50 p-3 rounded text-sm text-red-700">
          Document not uploaded
        </div>
      )}
    </div>
  );

  const BusinessDetailDialog = ({ seller }: { seller: SellerProfile }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {seller.business_name}
          {getStatusBadge(seller.verification_status)}
        </DialogTitle>
        <DialogDescription>
          Business verification details and documentation
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Business Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Business Details</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Business Name:</strong> {seller.business_name}</div>
              <div><strong>Description:</strong> {seller.business_description}</div>
              <div><strong>Registration Number:</strong> {seller.business_registration_number || 'N/A'}</div>
              <div><strong>Location:</strong> {seller.store_location}</div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{seller.average_rating}/5 ({seller.total_ratings} reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{seller.phone_number}</span>
              </div>
              {seller.whatsapp_number && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span>WhatsApp: {seller.whatsapp_number}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Applied {new Date(seller.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h4 className="font-semibold">Verification Documents</h4>
          {seller.verification_documents && typeof seller.verification_documents === 'object' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(seller.verification_documents as Record<string, any>).map(([key, value]) => (
                <DocumentViewer key={key} url={value as string} type={key.replace(/_/g, ' ').toUpperCase()} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No documents uploaded</p>
          )}
        </div>

        {/* Approval Actions */}
        {seller.verification_status === "pending" && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold">Review Actions</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="notes">Review Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this review..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleApproval(seller.id, "verified")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve Business
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleApproval(seller.id, "rejected")}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject Business
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Business Approval</h1>
        <Card>
          <CardContent className="h-96 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading businesses...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Business Approval</h1>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">
            {sellers.filter(s => s.verification_status === "pending").length} pending reviews
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {sellers.filter(s => s.verification_status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {sellers.filter(s => s.verification_status === "verified").length}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {sellers.filter(s => s.verification_status === "rejected").length}
            </div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{sellers.length}</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending ({sellers.filter(s => s.verification_status === "pending").length})</TabsTrigger>
              <TabsTrigger value="verified">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{seller.business_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {seller.business_description?.substring(0, 50)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{seller.owner_name}</div>
                          <div className="text-sm text-muted-foreground">{seller.phone_number}</div>
                          {seller.owner_email && (
                            <div className="text-xs text-muted-foreground">{seller.owner_email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{seller.store_location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(seller.verification_status)}</TableCell>
                      <TableCell>
                        {new Date(seller.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <BusinessDetailDialog seller={seller} />
                          </Dialog>
                          
                          {seller.verification_status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleApproval(seller.id, "verified")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleApproval(seller.id, "rejected")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};