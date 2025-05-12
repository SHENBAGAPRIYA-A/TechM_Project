
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { announcementsAPI } from "@/services/api";
import { Announcement } from "@/types/helpdesk";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import { format } from "date-fns";

const AdminAnnouncements = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    important: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await announcementsAPI.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
        toast({
          title: "Error",
          description: "Failed to load announcements. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, important: checked }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter an announcement title.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter announcement content.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateAnnouncement = async () => {
    if (!validateForm()) return;

    try {
      setFormLoading(true);

      const newAnnouncement = await announcementsAPI.createAnnouncement({
        title: formData.title,
        content: formData.content,
        important: formData.important,
        createdBy: "Admin User", // In a real app, this would come from the authenticated user
      });

      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setFormData({ title: "", content: "", important: false });
      setShowForm(false);

      toast({
        title: "Announcement Created",
        description: "Your announcement has been successfully created.",
      });
    } catch (error) {
      console.error("Failed to create announcement:", error);
      toast({
        title: "Creation Failed",
        description: "There was an error creating the announcement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await announcementsAPI.deleteAnnouncement(deleteId);
      
      setAnnouncements(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
      
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the announcement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout requireAuth requireAdmin>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-helpdesk-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Announcements</h1>
            <p className="text-gray-600">Create and manage announcements for students</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="helpdesk-gradient" 
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> 
                  New Announcement
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Create announcement form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Announcement</CardTitle>
              <CardDescription>
                Fill out the form below to create a new announcement that will be visible to all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter announcement title"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Enter announcement content"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="important" 
                    checked={formData.important}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="important"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as important
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    className="helpdesk-gradient" 
                    onClick={handleCreateAnnouncement}
                    disabled={formLoading}
                  >
                    {formLoading ? "Creating..." : "Create Announcement"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements list */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">All Announcements</h2>
          
          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                        {announcement.important && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{announcement.content}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>By {announcement.createdBy}</span>
                        <span className="mx-1">•</span>
                        <span>{format(new Date(announcement.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(announcement.id)}>
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this announcement? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteAnnouncement}
                            disabled={deleting}
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No announcements created yet</p>
              <Button onClick={() => setShowForm(true)}>
                Create Your First Announcement
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnnouncements;
