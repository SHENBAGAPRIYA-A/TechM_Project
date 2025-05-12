import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Mock settings data
const requestCategories = [
  { id: "cat1", name: "Maintenance", active: true },
  { id: "cat2", name: "IT Support", active: true },
  { id: "cat3", name: "ID Card", active: true },
  { id: "cat4", name: "Financial Aid", active: true },
  { id: "cat5", name: "Academic", active: true },
  { id: "cat6", name: "Other", active: true },
];

const priorityLevels = [
  { id: "p1", name: "Low", active: true },
  { id: "p2", name: "Medium", active: true },
  { id: "p3", name: "High", active: true },
];

const departments = [
  { id: "dept1", name: "Information Technology", active: true },
  { id: "dept2", name: "Maintenance", active: true },
  { id: "dept3", name: "Student Affairs", active: true },
  { id: "dept4", name: "Finance", active: true },
  { id: "dept5", name: "Academics", active: true },
];

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState(requestCategories);
  const [priorities, setPriorities] = useState(priorityLevels);
  const [deptList, setDeptList] = useState(departments);
  
  const [newCategoryDialog, setNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [editItemDialog, setEditItemDialog] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<{id: string, name: string, active: boolean}>({
    id: "", name: "", active: true
  });
  const [currentEditType, setCurrentEditType] = useState<"category" | "priority" | "department">("category");
  
  // System feature toggles
  const [featureToggles, setFeatureToggles] = useState({
    chatEnabled: true,
    feedbackEnabled: true,
    studentRegistration: true,
    fileUploads: true,
    autoAssignment: false,
    emailNotifications: true,
    pushNotifications: false
  });
  
  // Email template
  const [emailTemplate, setEmailTemplate] = useState({
    subject: "New update on your support request",
    body: "Dear {{student_name}},\n\nThere has been an update on your support request #{{request_id}}:\n\n{{update_message}}\n\nPlease log in to the Student Helpdesk portal to view more details or respond.\n\nRegards,\nStudent Helpdesk Team"
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleSaveGeneralSettings = () => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      toast.success("System settings saved successfully");
    }, 500);
  };
  
  const handleFeatureToggle = (feature: string, value: boolean) => {
    setFeatureToggles({ ...featureToggles, [feature]: value });
  };
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      const newCategory = {
        id: `cat${categories.length + 1}`,
        name: newCategoryName,
        active: true
      };
      
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryDialog(false);
      setLoading(false);
      toast.success("New category added");
    }, 500);
  };
  
  const handleEditItem = (item: any, type: "category" | "priority" | "department") => {
    setCurrentEditItem({ ...item });
    setCurrentEditType(type);
    setEditItemDialog(true);
  };
  
  const handleSaveEdit = () => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      if (currentEditType === "category") {
        setCategories(categories.map(item => 
          item.id === currentEditItem.id ? currentEditItem : item
        ));
      } else if (currentEditType === "priority") {
        setPriorities(priorities.map(item => 
          item.id === currentEditItem.id ? currentEditItem : item
        ));
      } else if (currentEditType === "department") {
        setDeptList(deptList.map(item => 
          item.id === currentEditItem.id ? currentEditItem : item
        ));
      }
      
      setEditItemDialog(false);
      setLoading(false);
      toast.success(`${currentEditType.charAt(0).toUpperCase() + currentEditType.slice(1)} updated`);
    }, 500);
  };
  
  const handleDeleteItem = (id: string, type: "category" | "priority" | "department") => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      if (type === "category") {
        setCategories(categories.filter(item => item.id !== id));
      } else if (type === "priority") {
        setPriorities(priorities.filter(item => item.id !== id));
      } else if (type === "department") {
        setDeptList(deptList.filter(item => item.id !== id));
      }
      
      setLoading(false);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`);
    }, 500);
  };
  
  const handleDatabaseBackup = () => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Database backup initiated. You will receive an email when complete.");
    }, 1500);
  };
  
  const handleDatabaseRestore = () => {
    // In a real app, this would open a file picker
    toast.info("Database restore functionality would be implemented here with a file picker");
  };

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure and customize the Student Helpdesk system</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="categories">Categories & Priorities</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          </TabsList>
          
          {/* Categories & Priorities Tab */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Request Categories</CardTitle>
                    <CardDescription>
                      Manage available request categories
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setNewCategoryDialog(true)}>
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map(category => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>
                            <Switch 
                              checked={category.active} 
                              onCheckedChange={(checked) => {
                                setCategories(categories.map(c => 
                                  c.id === category.id ? { ...c, active: checked } : c
                                ));
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditItem(category, "category")}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteItem(category.id, "category")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Priority Levels</CardTitle>
                  <CardDescription>
                    Manage available priority levels for requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priorities.map(priority => (
                        <TableRow key={priority.id}>
                          <TableCell>{priority.name}</TableCell>
                          <TableCell>
                            <Switch 
                              checked={priority.active} 
                              onCheckedChange={(checked) => {
                                setPriorities(priorities.map(p => 
                                  p.id === priority.id ? { ...p, active: checked } : p
                                ));
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditItem(priority, "priority")}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteItem(priority.id, "priority")}
                                disabled={priorities.length <= 2} // Prevent deleting if only 2 priorities left
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>
                    Manage university departments for request assignment
                  </CardDescription>
                </div>
                <Button size="sm">
                  Add Department
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deptList.map(dept => (
                      <TableRow key={dept.id}>
                        <TableCell>{dept.name}</TableCell>
                        <TableCell>
                          <Switch 
                            checked={dept.active} 
                            onCheckedChange={(checked) => {
                              setDeptList(deptList.map(d => 
                                d.id === dept.id ? { ...d, active: checked } : d
                              ));
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditItem(dept, "department")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteItem(dept.id, "department")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>System Features</CardTitle>
                <CardDescription>
                  Enable or disable system features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Support Chat</h3>
                    <p className="text-sm text-gray-500">Enable real-time chat between students and support staff</p>
                  </div>
                  <Switch 
                    checked={featureToggles.chatEnabled} 
                    onCheckedChange={(checked) => handleFeatureToggle("chatEnabled", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Feedback System</h3>
                    <p className="text-sm text-gray-500">Allow students to rate and provide feedback on resolved requests</p>
                  </div>
                  <Switch 
                    checked={featureToggles.feedbackEnabled} 
                    onCheckedChange={(checked) => handleFeatureToggle("feedbackEnabled", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Student Registration</h3>
                    <p className="text-sm text-gray-500">Allow new students to register accounts without admin approval</p>
                  </div>
                  <Switch 
                    checked={featureToggles.studentRegistration} 
                    onCheckedChange={(checked) => handleFeatureToggle("studentRegistration", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">File Uploads</h3>
                    <p className="text-sm text-gray-500">Allow file attachments in requests and chat messages</p>
                  </div>
                  <Switch 
                    checked={featureToggles.fileUploads} 
                    onCheckedChange={(checked) => handleFeatureToggle("fileUploads", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Assignment</h3>
                    <p className="text-sm text-gray-500">Automatically assign requests to staff based on category</p>
                  </div>
                  <Switch 
                    checked={featureToggles.autoAssignment} 
                    onCheckedChange={(checked) => handleFeatureToggle("autoAssignment", checked)}
                  />
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveGeneralSettings}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure notification channels and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Send email notifications for request updates</p>
                    </div>
                    <Switch 
                      checked={featureToggles.emailNotifications} 
                      onCheckedChange={(checked) => handleFeatureToggle("emailNotifications", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Enable browser push notifications</p>
                    </div>
                    <Switch 
                      checked={featureToggles.pushNotifications} 
                      onCheckedChange={(checked) => handleFeatureToggle("pushNotifications", checked)}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSaveGeneralSettings}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Email Template</CardTitle>
                  <CardDescription>
                    Configure email notification templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Subject Line</Label>
                    <Input 
                      id="email-subject"
                      value={emailTemplate.subject}
                      onChange={(e) => setEmailTemplate({...emailTemplate, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-body">Email Body</Label>
                    <Textarea 
                      id="email-body"
                      value={emailTemplate.body}
                      onChange={(e) => setEmailTemplate({...emailTemplate, body: e.target.value})}
                      rows={8}
                    />
                    <p className="text-xs text-gray-500">
                      Use {'{{student_name}}'}, {'{{request_id}}'}, {'{{update_message}}'} as placeholders that will be replaced with actual values.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSaveGeneralSettings}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Backup & Restore Tab */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Database Backup & Restore</CardTitle>
                <CardDescription>
                  Create backups or restore from previous backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Backup Database</h3>
                    <p className="text-gray-600 mb-4">
                      Create a complete backup of all system data. Backups are stored securely 
                      and can be used to restore the system in case of data loss.
                    </p>
                    <Button onClick={handleDatabaseBackup} disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Backup
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Restore From Backup</h3>
                    <p className="text-gray-600 mb-4">
                      Restore the system from a previously created backup file. 
                      <span className="font-semibold text-amber-600"> Warning: This will overwrite current data.</span>
                    </p>
                    <div className="flex gap-4">
                      <Select>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Select a backup" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="backup1">Backup - May 10, 2023 (09:30 AM)</SelectItem>
                          <SelectItem value="backup2">Backup - May 5, 2023 (02:15 PM)</SelectItem>
                          <SelectItem value="backup3">Backup - Apr 28, 2023 (11:45 AM)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={handleDatabaseRestore}>
                        Upload Backup File
                      </Button>
                      <Button variant="destructive">
                        Restore Selected
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Automatic Backups</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch id="auto-backup" />
                      <Label htmlFor="auto-backup">Enable automatic daily backups</Label>
                    </div>
                    <div className="text-gray-600">
                      When enabled, the system will automatically create a backup every day at midnight.
                      Automatic backups are kept for 30 days.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add New Category Dialog */}
      <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-name" className="text-right">
                Name
              </Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="Enter category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={loading || !newCategoryName.trim()}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={editItemDialog} onOpenChange={setEditItemDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Edit {currentEditType.charAt(0).toUpperCase() + currentEditType.slice(1)}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-name" className="text-right">
                Name
              </Label>
              <Input
                id="item-name"
                value={currentEditItem.name}
                onChange={(e) => setCurrentEditItem({...currentEditItem, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-status" className="text-right">
                Active
              </Label>
              <div className="col-span-3">
                <Switch 
                  id="item-status"
                  checked={currentEditItem.active} 
                  onCheckedChange={(checked) => setCurrentEditItem({...currentEditItem, active: checked})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading || !currentEditItem.name.trim()}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SystemSettings;
