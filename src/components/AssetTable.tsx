import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface AssetTableProps {
  asset: Asset | null;
}

export const AssetTable = ({ asset }: AssetTableProps) => {
  if (!asset) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const isCollectionOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-card">
      <CardHeader className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <CardTitle className="text-2xl font-bold text-center">
          Asset Information - {asset.securityCode}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Security Code:</span>
              <Badge variant="outline" className="text-brand-primary border-brand-primary">
                {asset.securityCode}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Transaction Code:</span>
              <span className="text-muted-foreground">{asset.transactionCode}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Depositor Name:</span>
              <span className="text-foreground font-medium">{asset.depositorName}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Next of Kin:</span>
              <span className="text-muted-foreground">{asset.nextOfKin}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Date of Deposit:</span>
              <span className="text-muted-foreground">{formatDate(asset.dateOfDeposit)}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Item Deposited:</span>
              <span className="text-foreground font-medium">{asset.itemDeposited}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Date of Collection:</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{formatDate(asset.dateOfCollection)}</span>
                {isCollectionOverdue(asset.dateOfCollection) && (
                  <Badge variant="destructive">Overdue</Badge>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Quantity (KG):</span>
              <span className="text-muted-foreground">{asset.quantity} kg</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="font-semibold text-foreground">Purpose of Deposit:</span>
              <span className="text-muted-foreground">{asset.purposeOfDeposit}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-accent/10 border border-accent rounded-lg">
              <span className="font-semibold text-foreground">Amount to be Paid:</span>
              <span className="text-accent font-bold text-lg">${asset.amountToBePaid}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};