import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { HackathonCard } from "@/components/HackathonCard";
import { HackathonForm } from "@/components/HackathonForm";
import { Plus, LogOut, Clipboard, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Hackathon } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getHackathons();
      setHackathons(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load hackathons",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingHackathon?._id) {
        const updated = await apiClient.updateHackathon(editingHackathon._id!, data);
        const cleanUpdated = {
          ...updated,
          techStack: Array.isArray(updated.techStack)
            ? updated.techStack
            : updated.techStack?.split(',').map((t) => t.trim()),
        };
        setHackathons((prev) =>
          prev.map((h) => (h._id === cleanUpdated._id ? cleanUpdated : h))
        );
        return cleanUpdated;
      } else {
        const newHackathon = await apiClient.createHackathon(data);
        await loadHackathons(); // Refresh the list
        return newHackathon;
        // setHackathons((prev) => [newHackathon, ...prev]);
      }
      // toast({
      //   title: "Success",
      //   description: editingHackathon ? "Hackathon updated" : "Hackathon created",
      // });
    } catch (error) {
      throw (error);
    } finally {
      setIsFormOpen(false);
      setEditingHackathon(undefined);
    }
  };

  const handleEditProfile = () => {
    navigate("/profile/me");
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/profile/${user?.username}/full`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link Copied",
      description: "Your public profile URL is now in clipboard 🚀",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-muted-foreground">Track and manage your hackathon journey</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setIsFormOpen(true)} variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Hackathon
            </Button>
            <Button onClick={handleEditProfile} variant="outline">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button onClick={handleCopyLink} variant="outline">
              <Clipboard className="w-4 h-4 mr-2" />
              Copy Public Link
            </Button>
            <Button onClick={logout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">Loading your hackathons...</div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <h2 className="text-2xl font-semibold text-muted-foreground">No hackathons yet</h2>
            <p className="text-muted-foreground">Start tracking your first hackathon!</p>
            <Button onClick={() => setIsFormOpen(true)} variant="hero" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Hackathon
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon._id}
                hackathon={hackathon}
                onEdit={(h) => {
                  setEditingHackathon(h);
                  setIsFormOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <HackathonForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingHackathon(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={editingHackathon}
      />
    </div>
  );
}
