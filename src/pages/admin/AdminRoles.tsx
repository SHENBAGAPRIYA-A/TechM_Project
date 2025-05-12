
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Edit, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";

// Mock admin/staff data
const mockStaff = [
  {
    id: "admin1",
    name: "David Wilson",
    email: "d.wilson@university.edu",
    role: "super-admin",
    department: "IT Services",
    lastLogin: "2023-05-10T09:30:00",
    status: "active"
  },
  {
    id: "admin2",
    name: "Patricia Moore",
    email: "p.moore@university.edu",
    role: "admin",
    department: "Student Services",
    lastLogin: "2023-05-09T15:45:00",
    status: "active"
  },
  {
    id: "admin3",
    name: "Robert Taylor",
    email: "r.taylor@university.edu",
    role: "staff",
    department: "Maintenance",
    lastLogin: "2023-05-08T11:20:00",
    status: "active"
  },
  {
    id: "admin4",
    name: "Jennifer Adams",
    email: "j.adams@university.edu",
    role: "hostel-admin",
    department: "Housing Services",
    lastLogin: "2023-05-07T14:15:00",
    status: "inactive"
  }
];

// Mock login activity
const mockLoginActivity = [
  {
    id: "log1",
    userId: "admin1",
    userName: "David Wilson",
    timestamp: "2023-05-10T09:30:00",
    action: "login",
    ipAddress: "192.168.1.45",
    device: "Chrome/Windows 10"
  },
  {
    id: "log2",
    userId: "admin2",
    userName: "Patricia Moore",
    timestamp: "2023-05-09T15:45:00",
    action: "login",
    ipAddress: "192.168.1.65",
    device: "Safari/MacOS"
  },
  {
    id: "log3",
    userId: "admin3",
    userName: "Robert Taylor",
    timestamp: "2023-05-08T11:20:00",
    action: "login",
    ipAddress: "192.168.1.30",
    device: "Firefox/Windows 11"
  },
  {
    id: "log4",
    userId: "admin1",
    userName: "David Wilson",
    timestamp: "2023-05-07T08:15:00",
    action: "logout",
    ipAddress: "192.168.1.45",
    device: "Chrome/Windows 10"
  }
];

// Permission sets
const permissionSets = {
  "super-admin": ["manage_admins", "manage_students", "manage_settings", "manage_tickets", "view_reports"],
  "admin": ["manage_students", "manage_tickets", "view_reports"],
  "staff": ["manage_tickets"],
  "hostel-admin": ["manage_tickets", "view_reports"]
};

const AdminRoles = () => {
  const [staff, setStaff] = useState(mockStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [newStaffDialogOpen, setNewStaffDialogOpen] = useState(false);
  const [editStaffDialogOpen, setEditStaffDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<any>(null);
  const [activityTab, setActivityTab] = useState("staff"); // "staff" or "activity"
  const [loading, setLoading] = useState(false);
  
  const [newStaffData, setNewStaffData] = useState({
    name: "",
    email: "",
    role: "staff",
    department: "",
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: "manage_admins", label: "Manage Admin Accounts" },
    { id: "manage_students", label: "Manage Student Accounts" },
    { id: "manage_settings", label: "Manage System Settings" },
    { id: "manage_tickets", label: "Manage Support Tickets" },
    { id: "view_reports", label: "View Reports & Analytics" }
  ];

  const filteredStaff = staff.filter(
    admin => 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNewStaff = () => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      const newStaff = {
        id: `admin${staff.length + 1}`,
        name: newStaffData.name,
        email: newStaffData.email,
        role: newStaffData.role,
        department: newStaffData.department,
        lastLogin: "Never",
        status: "active"
      };
      
      setStaff([...staff, newStaff]);
      setLoading(false);
      setNewStaffDialogOpen(false);
      setNewStaffData({
        name: "",
        email: "",
        role: "staff",
        department: "",
        permissions: []
      });
      
      toast.success("New admin account created");
    }, 500);
  };

  const handleEditStaff = (staffMember: any) => {
    setCurrentStaff({...staffMember});
    setEditStaffDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setStaff(staff.map(s => 
        s.id === currentStaff.id ? currentStaff : s
      ));
      setLoading(false);
      setEditStaffDialogOpen(false);
      toast.success("Admin account updated");
    }, 500);
  };

  const handleDeleteStaff = (staffId: string) => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setStaff(staff.filter(s => s.id !== staffId));
      setLoading(false);
      toast.success("Admin account removed");
    }, 500);
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'super-admin': 
        return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>;
      case 'admin': 
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case 'staff': 
        return <Badge className="bg-green-100 text-green-800">Staff</Badge>;
      case 'hostel-admin': 
        return <Badge className="bg-orange-100 text-orange-800">Hostel Admin</Badge>;
      default: 
        return <Badge className="bg-gray-100 text-gray-800">{role}</Badge>;
    }
  };

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin & Staff Management</h1>
            <p className="text-gray-600">Manage admin accounts, roles and permissions</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={activityTab === "staff" ? "default" : "outline"} 
              onClick={() => setActivityTab("staff")}
            >
              <UserRound className="mr-2 h-4 w-4" />
              Staff Accounts
            </Button>
            <Button
              variant={activityTab === "activity" ? "default" : "outline"}
              onClick={() => setActivityTab("activity")}
            >
              Activity Logs
            </Button>
          </div>
        </div>
        
        {activityTab === "staff" ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Admin & Staff Accounts</CardTitle>
                  <CardDescription>Manage administrator and staff accounts</CardDescription>
                </div>
                <Button onClick={() => setNewStaffDialogOpen(true)}>
                  Add New Admin
                </Button>
              </div>
              <div className="pt-2">
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map(staffMember => (
                    <TableRow key={staffMember.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{staffMember.name}</div>
                          <div className="text-xs text-gray-500">{staffMember.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(staffMember.role)}</TableCell>
                      <TableCell>{staffMember.department}</TableCell>
                      <TableCell>
                        {staffMember.lastLogin === "Never" 
                          ? "Never" 
                          : new Date(staffMember.lastLogin).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={staffMember.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"}
                        >
                          {staffMember.status.charAt(0).toUpperCase() + staffMember.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditStaff(staffMember)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteStaff(staffMember.id)}
                            disabled={staffMember.role === "super-admin"}
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
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Login Activity</CardTitle>
              <CardDescription>Recent login and system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device/Browser</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLoginActivity.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="font-medium">{log.userName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={log.action === "login" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                          {log.action.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                      <TableCell>{log.device}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add New Staff Dialog */}
      <Dialog open={newStaffDialogOpen} onOpenChange={setNewStaffDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Admin Account</DialogTitle>
            <DialogDescription>
              Create a new administrator or staff account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newStaffData.name}
                onChange={(e) => setNewStaffData({...newStaffData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newStaffData.email}
                onChange={(e) => setNewStaffData({...newStaffData, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                value={newStaffData.department}
                onChange={(e) => setNewStaffData({...newStaffData, department: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select 
                onValueChange={(value) => setNewStaffData({...newStaffData, role: value, permissions: permissionSets[value as keyof typeof permissionSets] || []})} 
                defaultValue={newStaffData.role}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="hostel-admin">Hostel Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Permissions
              </Label>
              <div className="col-span-3 space-y-2">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={permission.id} 
                      checked={(permissionSets[newStaffData.role as keyof typeof permissionSets] || []).includes(permission.id)}
                      disabled={true} // Disabled because permissions are role-based
                    />
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">
                  Permissions are determined by the selected role
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewStaffDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddNewStaff} 
              disabled={loading || !newStaffData.name || !newStaffData.email || !newStaffData.department}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={editStaffDialogOpen} onOpenChange={setEditStaffDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Admin Account</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={currentStaff?.name || ""}
                onChange={(e) => setCurrentStaff({...currentStaff, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                value={currentStaff?.email || ""}
                onChange={(e) => setCurrentStaff({...currentStaff, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                Department
              </Label>
              <Input
                id="edit-department"
                value={currentStaff?.department || ""}
                onChange={(e) => setCurrentStaff({...currentStaff, department: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select 
                value={currentStaff?.role || "staff"}
                onValueChange={(value) => setCurrentStaff({...currentStaff, role: value})}
                disabled={currentStaff?.role === "super-admin"}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="hostel-admin">Hostel Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select 
                value={currentStaff?.status || "active"}
                onValueChange={(value) => setCurrentStaff({...currentStaff, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStaffDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminRoles;
