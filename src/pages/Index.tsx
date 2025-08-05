import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { AssetTable } from "@/components/AssetTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, FileCheck, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import assetsData from "@/data/assets.json";

interface Asset {
  securityCode: string;
  transactionCode: string;
  depositorName: string;
  nextOfKin: string;
  dateOfDeposit: string;
  itemDeposited: string;
  dateOfCollection: string;
  quantity: string;
  purposeOfDeposit: string;
  amountToBePaid: string;
}

const Index = () => {
  const [foundAsset, setFoundAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = (code: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Load from localStorage if available, otherwise use default data
      const savedAssets = localStorage.getItem('gsfc-assets');
      const assets = savedAssets ? JSON.parse(savedAssets) : assetsData;
      
      const asset = assets.find(
        (item: Asset) => item.securityCode.toLowerCase() === code.toLowerCase()
      );
      
      if (asset) {
        setFoundAsset(asset);
        toast({
          title: "Asset Found",
          description: `Successfully retrieved information for ${code}`,
        });
      } else {
        setFoundAsset(null);
        toast({
          variant: "destructive",
          title: "Asset Not Found",
          description: `No asset found with security code: ${code}`,
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary shadow-elegant">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-12 w-12" />
              <h1 className="text-5xl font-bold">GSFC</h1>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg" className="ml-4 bg-white text-brand-primary hover:bg-white/90">
                  <Settings className="w-5 h-5 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
            <p className="text-xl opacity-90">Global Safekeeping & Financial Center</p>
            <p className="text-lg opacity-75 mt-2">Secure Asset Management & Storage Solutions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Asset Lookup</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Enter your security code below to retrieve detailed information about your deposited assets and storage details.
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Features Section */}
        {!foundAsset && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Lock className="h-12 w-12 mx-auto mb-4 text-brand-primary" />
                <h3 className="font-semibold mb-2">Secure Storage</h3>
                <p className="text-sm text-muted-foreground">
                  State-of-the-art security systems protecting your valuable assets
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <FileCheck className="h-12 w-12 mx-auto mb-4 text-brand-secondary" />
                <h3 className="font-semibold mb-2">Complete Records</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed documentation and tracking of all deposited items
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-brand-accent" />
                <h3 className="font-semibold mb-2">Trusted Service</h3>
                <p className="text-sm text-muted-foreground">
                  Years of experience in safekeeping and financial services
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Asset Information Table */}
        {foundAsset && (
          <div className="mt-8">
            <AssetTable asset={foundAsset} />
          </div>
        )}

        {/* Sample Codes Hint */}
        {!foundAsset && (
          <div className="text-center mt-12">
            <Card className="max-w-md mx-auto bg-muted/50">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Sample Security Codes</h4>
                <p className="text-sm text-muted-foreground mb-2">Try searching with:</p>
                <div className="space-y-1 text-sm">
                  <div>GSFC001, GSFC002, GSFC003</div>
                  <div>GSFC004, GSFC005</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
