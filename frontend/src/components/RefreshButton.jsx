import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function RefreshButton({ onClick, loading = false }) {
  return (
    <Button 
      onClick={onClick} 
      variant="outline" 
      disabled={loading}
      className="border-purple-200 hover:bg-purple-50"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      Refresh
    </Button>
  );
}
