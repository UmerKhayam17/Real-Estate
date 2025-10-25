// /app/(pages)/dealer/profile/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDealerProfile } from "@/hooks/useDealerProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building, MapPin, Phone, User } from "lucide-react";

export default function DealerProfilePage() {
  const router = useRouter();
  const {
    dealerStatus,
    statusLoading,
    companies,
    completeProfile,
    isSubmitting,
  } = useDealerProfile();

  const [form, setForm] = useState({
    businessName: "",
    licenseNumber: "",
    officeAddress: "",
    officeCity: "",
    yearsOfExperience: "",
    specialization: [],
    description: "",
    website: "",
    whatsappNumber: "",
    cnic: "",
    companyId: "",
  });

  const [specializationInput, setSpecializationInput] = useState("");

  // Redirect if profile already completed
  useEffect(() => {
    if (dealerStatus?.hasDealerProfile) {
      router.push("/dealer/dashboard");
    }
  }, [dealerStatus, router]);

  const handleAddSpecialization = () => {
    if (specializationInput.trim() && !form.specialization.includes(specializationInput.trim())) {
      setForm(prev => ({
        ...prev,
        specialization: [...prev.specialization, specializationInput.trim()]
      }));
      setSpecializationInput("");
    }
  };

  const handleRemoveSpecialization = (item) => {
    setForm(prev => ({
      ...prev,
      specialization: prev.specialization.filter(s => s !== item)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    completeProfile(form);
  };

  if (statusLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Complete Dealer Profile
          </CardTitle>
          <CardDescription>
            Fill in your business details to start using the platform as a dealer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Name *</label>
                <Input
                  placeholder="Enter your business name"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">License Number</label>
                <Input
                  placeholder="Business license number"
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Office Address *</label>
                <Input
                  placeholder="Full office address"
                  value={form.officeAddress}
                  onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">City *</label>
                <Input
                  placeholder="City"
                  value={form.officeCity}
                  onChange={(e) => setForm({ ...form, officeCity: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Experience & Specialization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.yearsOfExperience}
                  onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CNIC *</label>
                <Input
                  placeholder="12345-6789012-3"
                  value={form.cnic}
                  onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Specialization */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialization</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add specialization (e.g., Residential, Commercial)"
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialization())}
                />
                <Button type="button" onClick={handleAddSpecialization} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.specialization.map((item, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(item)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input
                  placeholder="https://yourwebsite.com"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Number</label>
                <Input
                  placeholder="+1234567890"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Description</label>
              <Textarea
                placeholder="Describe your business, services, and expertise..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Company Join Section */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Join a Company (Optional)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                You can choose to join a company now or remain as an independent dealer.
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Company</label>
                <Select
                  value={form.companyId}
                  onValueChange={(value) => setForm({ ...form, companyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a company to join (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Independent Dealer</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        <div className="flex flex-col">
                          <span>{company.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {company.city} • {company.dealerSlots} slots available
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.companyId && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>
                      You&apos;re requesting to join {
                        companies.find(c => c.id === form.companyId)?.name
                      }. The company admin will review your request.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Profile...
                </>
              ) : (
                "Submit Profile for Approval"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}