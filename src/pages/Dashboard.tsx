import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
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

const Dashboard = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load assets from localStorage or use default data
  useEffect(() => {
    const savedAssets = localStorage.getItem('gsfc-assets');
    if (savedAssets) {
      setAssets(JSON.parse(savedAssets));
    } else {
      setAssets(assetsData);
      localStorage.setItem('gsfc-assets', JSON.stringify(assetsData));
    }
  }, []);

  // Save assets to localStorage whenever assets change
  useEffect(() => {
    localStorage.setItem('gsfc-assets', JSON.stringify(assets));
  }, [assets]);

  const generateSecurityCode = () => {
    const maxCode = Math.max(...assets.map(asset => 
      parseInt(asset.securityCode.replace('GSFC', ''))
    ));
    return `GSFC${String(maxCode + 1).padStart(3, '0')}`;
  };

  const generateTransactionCode = () => {
    const year = new Date().getFullYear();
    const maxTxn = Math.max(...assets.map(asset => 
      parseInt(asset.transactionCode.split('-')[2])
    ));
    return `TXN-${year}-${String(maxTxn + 1).padStart(3, '0')}`;
  };

  const handleAddAsset = (formData: FormData) => {
    const newAsset: Asset = {
      securityCode: generateSecurityCode(),
      transactionCode: generateTransactionCode(),
      depositorName: formData.get('depositorName') as string,
      nextOfKin: formData.get('nextOfKin') as string,
      dateOfDeposit: formData.get('dateOfDeposit') as string,
      itemDeposited: formData.get('itemDeposited') as string,
      dateOfCollection: formData.get('dateOfCollection') as string,
      quantity: formData.get('quantity') as string,
      purposeOfDeposit: formData.get('purposeOfDeposit') as string,
      amountToBePaid: formData.get('amountToBePaid') as string,
    };

    setAssets([...assets, newAsset]);
    setIsAddDialogOpen(false);
    toast({
      title: "Asset Added",
      description: `Asset ${newAsset.securityCode} has been added successfully.`,
    });
  };

  const handleEditAsset = (formData: FormData) => {
    if (!editingAsset) return;

    const updatedAsset: Asset = {
      ...editingAsset,
      depositorName: formData.get('depositorName') as string,
      nextOfKin: formData.get('nextOfKin') as string,
      dateOfDeposit: formData.get('dateOfDeposit') as string,
      itemDeposited: formData.get('itemDeposited') as string,
      dateOfCollection: formData.get('dateOfCollection') as string,
      quantity: formData.get('quantity') as string,
      purposeOfDeposit: formData.get('purposeOfDeposit') as string,
      amountToBePaid: formData.get('amountToBePaid') as string,
    };

    setAssets(assets.map(asset => 
      asset.securityCode === editingAsset.securityCode ? updatedAsset : asset
    ));
    setIsEditDialogOpen(false);
    setEditingAsset(null);
    toast({
      title: "Asset Updated",
      description: `Asset ${updatedAsset.securityCode} has been updated successfully.`,
    });
  };

  const handleDeleteAsset = (securityCode: string) => {
    setAssets(assets.filter(asset => asset.securityCode !== securityCode));
    toast({
      title: "Asset Deleted",
      description: `Asset ${securityCode} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const AssetForm = ({ asset, onSubmit }: { asset?: Asset, onSubmit: (formData: FormData) => void }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(new FormData(e.currentTarget));
    }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="depositorName">Depositor Name</Label>
          <Input name="depositorName" defaultValue={asset?.depositorName} required />
        </div>
        <div>
          <Label htmlFor="nextOfKin">Next of Kin</Label>
          <Input name="nextOfKin" defaultValue={asset?.nextOfKin} required />
        </div>
        <div>
          <Label htmlFor="dateOfDeposit">Date of Deposit</Label>
          <Input name="dateOfDeposit" type="date" defaultValue={asset?.dateOfDeposit} required />
        </div>
        <div>
          <Label htmlFor="itemDeposited">Item Deposited</Label>
          <Input name="itemDeposited" defaultValue={asset?.itemDeposited} required />
        </div>
        <div>
          <Label htmlFor="dateOfCollection">Date of Collection</Label>
          <Input name="dateOfCollection" type="date" defaultValue={asset?.dateOfCollection} required />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity (KG)</Label>
          <Input name="quantity" type="number" step="0.1" defaultValue={asset?.quantity} required />
        </div>
        <div>
          <Label htmlFor="purposeOfDeposit">Purpose of Deposit</Label>
          <Input name="purposeOfDeposit" defaultValue={asset?.purposeOfDeposit} required />
        </div>
        <div>
          <Label htmlFor="amountToBePaid">Amount to be Paid</Label>
          <Input name="amountToBePaid" type="number" step="0.01" defaultValue={asset?.amountToBePaid} required />
        </div>
      </div>
      <Button type="submit" className="w-full">
        {asset ? 'Update Asset' : 'Add Asset'}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">GSFC Asset Management</h1>
            <p className="text-muted-foreground">Manage all deposited assets and items</p>
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Asset Dashboard</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-brand-primary hover:bg-white/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add New Asset</DialogTitle>
                  </DialogHeader>
                  <AssetForm onSubmit={handleAddAsset} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Security Code</TableHead>
                    <TableHead>Depositor</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Deposit Date</TableHead>
                    <TableHead>Collection Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.securityCode}>
                      <TableCell>
                        <Badge variant="outline" className="text-brand-primary border-brand-primary">
                          {asset.securityCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{asset.depositorName}</TableCell>
                      <TableCell>{asset.itemDeposited}</TableCell>
                      <TableCell>{new Date(asset.dateOfDeposit).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {new Date(asset.dateOfCollection).toLocaleDateString()}
                          {new Date(asset.dateOfCollection) < new Date() && (
                            <Badge variant="destructive">Overdue</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-accent">${asset.amountToBePaid}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={isEditDialogOpen && editingAsset?.securityCode === asset.securityCode} 
                                  onOpenChange={(open) => {
                                    setIsEditDialogOpen(open);
                                    if (!open) setEditingAsset(null);
                                  }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingAsset(asset)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Edit Asset - {asset.securityCode}</DialogTitle>
                              </DialogHeader>
                              <AssetForm asset={asset} onSubmit={handleEditAsset} />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.securityCode)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;