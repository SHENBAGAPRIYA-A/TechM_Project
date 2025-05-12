
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { profileAPI } from "@/services/api";
import { Profile } from "@/types/helpdesk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Loader2,
  Camera,
  Bell,
  History,
  Lock,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { requestsAPI } from "@/services/api";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [requestHistory, setRequestHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Initialize notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: false,
    inApp: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await profileAPI.getProfile(user.id);
        setProfile(data);
        setFormData(data);
        
        // Initialize notification preferences from profile if available
        if (data.notificationPreferences) {
          setNotificationPreferences(data.notificationPreferences);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, toast]);

  useEffect(() => {
    const fetchRequestHistory = async () => {
      if (!user?.id) return;

      try {
        setHistoryLoading(true);
        const requests = await requestsAPI.getRequests(user.id);
        setRequestHistory(requests);
      } catch (error) {
        console.error("Failed to fetch request history:", error);
        toast({
          title: "Error",
          description: "Failed to load request history. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchRequestHistory();
  }, [user?.id, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNotificationChange = (type: 'email' | 'push' | 'inApp', checked: boolean) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (user?.role === "student" && !formData.department?.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    try {
      setSaving(true);

      if (!user?.id) {
        throw new Error("User ID not available");
      }

      // Include notification preferences in the update
      const updatedData = {
        ...formData,
        notificationPreferences
      };

      await profileAPI.updateProfile(user.id, updatedData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setSaving(true);

      // Simulating password change - in a real app, use proper authentication service
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form fields after successful password change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      toast({
        title: "Password Update Failed",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // In a real app, upload the file to storage and get the URL
      // For our mock API, we'll simulate this
      const photoUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({ ...prev, photo: photoUrl }));
      
      toast({
        title: "Photo Uploaded",
        description: "Your profile photo has been updated.",
      });
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout requireAuth>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-helpdesk-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
          </TabsList>
          
          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow">
                      {formData.photo ? (
                        <img 
                          src={formData.photo} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-gray-400">
                          {formData.name?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-helpdesk-600 rounded-full p-1 cursor-pointer shadow">
                      <Camera className="h-4 w-4 text-white" />
                      <input 
                        id="photo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleProfilePhotoUpload}
                      />
                    </label>
                  </div>
                </div>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {user?.role === "student" ? (
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          name="studentId"
                          value={formData.studentId || ""}
                          disabled
                          className="bg-gray-100"
                        />
                        <p className="text-sm text-gray-500">
                          Student ID cannot be changed
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="staffId">Staff ID</Label>
                        <Input
                          id="staffId"
                          name="staffId"
                          value={formData.staffId || ""}
                          disabled
                          className="bg-gray-100"
                        />
                        <p className="text-sm text-gray-500">
                          Staff ID cannot be changed
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department || ""}
                        onChange={handleChange}
                        className={errors.department ? "border-red-500" : ""}
                      />
                      {errors.department && (
                        <p className="text-sm text-red-500">{errors.department}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contactInfo">Additional Contact Information</Label>
                      <Textarea
                        id="contactInfo"
                        name="contactInfo"
                        rows={3}
                        value={formData.contactInfo || ""}
                        onChange={handleChange}
                        placeholder="Additional contact information, alternative email, etc."
                        className={errors.contactInfo ? "border-red-500" : ""}
                      />
                      {errors.contactInfo && (
                        <p className="text-sm text-red-500">{errors.contactInfo}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="helpdesk-gradient"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={passwordErrors.currentPassword ? "border-red-500" : ""}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={passwordErrors.newPassword ? "border-red-500" : ""}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Password must be at least 8 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="helpdesk-gradient"
                      disabled={saving}
                    >
                      {saving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notificationPreferences.email}
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive push notifications on your device
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notificationPreferences.push}
                        onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="inapp-notifications">In-App Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications within the application
                        </p>
                      </div>
                      <Switch
                        id="inapp-notifications"
                        checked={notificationPreferences.inApp}
                        onCheckedChange={(checked) => handleNotificationChange('inApp', checked)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="helpdesk-gradient"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Request History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>
                  View your previous support requests and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin h-6 w-6 text-helpdesk-600" />
                  </div>
                ) : requestHistory.length > 0 ? (
                  <div className="space-y-4">
                    {requestHistory.map((request: any) => (
                      <div key={request.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{request.title}</h3>
                            <p className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</p>
                            <div className="mt-1 flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                request.status === 'open'
                                  ? 'bg-green-100 text-green-800'
                                  : request.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : request.status === 'resolved'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {request.status}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                request.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : request.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {request.priority}
                              </span>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/requests/${request.id}`}>View Details</a>
                            </Button>
                          </div>
                        </div>
                        
                        {request.rating && (
                          <div className="mt-3 border-t pt-3">
                            <p className="text-sm font-medium">Your Feedback</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < request.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="ml-2 text-xs text-gray-600">
                                {request.feedback && `"${request.feedback}"`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No request history</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't submitted any support requests yet.</p>
                    <div className="mt-6">
                      <Button asChild>
                        <a href="/new-request">Create a request</a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
