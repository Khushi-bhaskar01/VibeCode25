import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Hackathon } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const hackathonSchema = z.object({
  hackName: z.string().min(1, "Hackathon name is required"),
  organization: z.string().optional(),
  officialLink: z.string().url("Must be a valid URL"),
  appliedDate: z.string().min(1, "Applied date is required"),
  lastDateToApply: z.string().min(1, "Application deadline is required"),
  lastDateToSubmit: z.string().optional(),
  status: z.enum(['Applied', 'Accepted', 'Rejected', 'In Progress', 'Completed']).optional(),
  projectLink: z.string().url().optional().or(z.literal("")),
  githubLink: z.string().url().optional().or(z.literal("")),
  certificateUrl: z.string().url().optional().or(z.literal("")),
  teamType: z.enum(['Solo', 'Team']).optional(),
  description: z.string().optional(),
});

type HackathonFormData = z.infer<typeof hackathonSchema>;

interface HackathonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HackathonFormData & { techStack?: string[] }) => Promise<any>;
  initialData?: Hackathon;
  isLoading?: boolean;
}

export const HackathonForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: HackathonFormProps) => {
  const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || []);
  const [newTech, setNewTech] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<HackathonFormData>({
    resolver: zodResolver(hackathonSchema),
    defaultValues: {
      hackName: '',
      organization: '',
      officialLink: '',
      appliedDate: '',
      lastDateToApply: '',
      lastDateToSubmit: '',
      status: 'Applied',
      projectLink: '',
      githubLink: '',
      certificateUrl: '',
      teamType: 'Solo',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        hackName: initialData.hackName || '',
        organization: initialData.organization || '',
        officialLink: initialData.officialLink || '',
        appliedDate: initialData.appliedDate ? new Date(initialData.appliedDate).toISOString().split('T')[0] : '',
        lastDateToApply: initialData.lastDateToApply ? new Date(initialData.lastDateToApply).toISOString().split('T')[0] : '',
        lastDateToSubmit: initialData.lastDateToSubmit ? new Date(initialData.lastDateToSubmit).toISOString().split('T')[0] : '',
        status: initialData.status || 'Applied',
        projectLink: initialData.projectLink || '',
        githubLink: initialData.githubLink || '',
        certificateUrl: initialData.certificateUrl || '',
        teamType: initialData.teamType || 'Solo',
        description: initialData.description || '',
      });
      setTechStack(initialData.techStack || []);
    }
  }, [initialData, form]);

  const addTech = () => {
    const trimmed = newTech.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = async (data: HackathonFormData) => {
  if (loading) return;
  setLoading(true);
  try {
    const result = await onSubmit({ 
      ...data, 
      techStack: Array.isArray(techStack) ? techStack.map(item => String(item)) : []
    });

    toast({
      title: "Success",
      description: initialData
        ? "Hackathon updated successfully!"
        : "Hackathon added successfully!",
    });

    form.reset();
    setTechStack([]);
    onClose();

  } catch (error) {
    console.error("Silent error:", error);
    // toast({
    //   title: "Error",
    //   description: error instanceof Error ? error.message : "Something went wrong",
    //   variant: "destructive",
    // });
  } finally {
    setLoading(false);
  }
 };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            {initialData ? 'Edit Hackathon' : 'Add New Hackathon'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Hackathon Name & Org */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="hackName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Hackathon Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., MLH Hack the Future" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="organization" render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl><Input placeholder="e.g., MLH" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Official Link */}
            <FormField control={form.control} name="officialLink" render={({ field }) => (
              <FormItem>
                <FormLabel>Official Link *</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['appliedDate', 'lastDateToApply', 'lastDateToSubmit'].map((name, i) => (
                <FormField key={name} control={form.control} name={name as keyof HackathonFormData} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{['Applied Date *', 'Application Deadline *', 'Submission Deadline'][i]}</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
            </div>

            {/* Status & Team Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['Applied', 'Accepted', 'Rejected', 'In Progress', 'Completed'].map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="teamType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select team type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Solo">Solo</SelectItem>
                      <SelectItem value="Team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
              <FormLabel>Tech Stack</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology..."
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                />
                <Button type="button" onClick={addTech} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['projectLink', 'githubLink', 'certificateUrl'].map((name, i) => (
                <FormField key={name} control={form.control} name={name as keyof HackathonFormData} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{['Project Link', 'GitHub Link', 'Certificate URL'][i]}</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
            </div>

            {/* Description */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your hackathon experience..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? 'Saving...' : initialData ? 'Update' : 'Add Hackathon'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
