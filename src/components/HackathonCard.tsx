import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { ExternalLink, Github, Calendar, Users, Edit } from "lucide-react";
import { Hackathon } from "@/lib/api";

interface HackathonCardProps {
  hackathon: Hackathon;
  onEdit: (hackathon: Hackathon) => void;
}

export const HackathonCard = ({ hackathon, onEdit }: HackathonCardProps) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  const isDeadlineNear = (dateString?: string) => {
    if (!dateString) return false;
    const deadline = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // ✅ Normalize techStack safely
  const normalizedTechStack = Array.isArray(hackathon.techStack)
    ? hackathon.techStack
    : typeof hackathon.techStack === "string"
    ? hackathon.techStack.split(",").map((t) => t.trim())
    : [];

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] animate-fade-in border-border/50 hover:border-primary/20">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
              {hackathon.hackName}
            </CardTitle>
            {hackathon.organization && (
              <CardDescription className="text-muted-foreground">
                {hackathon.organization}
              </CardDescription>
            )}
          </div>
          <StatusBadge status={hackathon.status} />
        </div>

        <div className="flex flex-wrap gap-2">
          {hackathon.teamType && (
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {hackathon.teamType}
            </Badge>
          )}

          {hackathon.lastDateToApply && (
            <Badge
              variant="outline"
              className={`text-xs ${
                isOverdue(hackathon.lastDateToApply)
                  ? "text-destructive border-destructive/20 bg-destructive/10"
                  : isDeadlineNear(hackathon.lastDateToApply)
                  ? "text-warning border-warning/20 bg-warning/10"
                  : ""
              }`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              Apply by: {formatDate(hackathon.lastDateToApply)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hackathon.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {hackathon.description}
          </p>
        )}

        {normalizedTechStack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {normalizedTechStack.slice(0, 3).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}

            {normalizedTechStack.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{normalizedTechStack.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            {hackathon.officialLink && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-primary/10 hover:border-primary/20"
              >
                <a
                  href={hackathon.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}

            {hackathon.githubLink && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-primary/10 hover:border-primary/20"
              >
                <a
                  href={hackathon.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(hackathon)}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        {hackathon.appliedDate && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
            Applied on: {formatDate(hackathon.appliedDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
