import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'default'; // green
      case 'Accepted':
        return 'secondary';
      case 'In Progress':
        return 'outline';
      case 'Applied':
        return 'outline';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'text-success bg-success/10 border-success/20';
      case 'Accepted':
        return 'text-info bg-info/10 border-info/20';
      case 'In Progress':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'Applied':
        return 'text-muted-foreground bg-muted border-border';
      case 'Rejected':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <Badge 
      variant={getStatusVariant(status)} 
      className={`${getStatusColor(status)} transition-all duration-300 hover:scale-105`}
    >
      {status || 'Unknown'}
    </Badge>
  );
};