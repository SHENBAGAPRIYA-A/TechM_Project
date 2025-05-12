
import { useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Edit, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

// Mock student data
const mockStudents = [
  {
    id: "st1",
    name: "Alex Johnson",
    email: "alex.j@university.edu",
    studentId: "U20210045",
    department: "Computer Science",
    status: "active",
    requestCount: 8,
    joinedOn: "2021-09-01",
    lastActive: "2023-05-10"
  },
  {
    id: "st2",
    name: "Sarah Williams",
    email: "s.williams@university.edu",
    studentId: "U20190126",
    department: "Engineering",
    status: "active",
    requestCount: 5,
    joinedOn: "2019-09-05",
    lastActive: "2023-05-09"
  },
  {
    id: "st3",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    studentId: "U20220089",
    department: "Business Administration",
    status: "suspended",
    requestCount: 2,
    joinedOn: "2022-01-15",
    lastActive: "2023-04-20"
  },
  {
    id: "st4",
    name: "Jessica Davis",
    email: "j.davis@university.edu",
    studentId: "U20200056",
    department: "Psychology",
    status: "inactive",
    requestCount: 12,
    joinedOn: "2020-09-02",
    lastActive: "2022-12-15"
  }
];

const StudentManagement = () => {
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [suspensionReason, setSuspensionReason] = useState("");

  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStudent = (student: any) => {
    setCurrentStudent({...student});
    setEditDialogOpen(true);
  };

  const handleSuspendStudent = (student: any) => {
    setCurrentStudent({...student});
    setSuspendDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setStudents(students.map(s => 
        s.id === currentStudent.id ? currentStudent : s
      ));
      setLoading(false);
      setEditDialogOpen(false);
      toast.success("Student information updated");
    }, 500);
  };

  const handleConfirmSuspension = () => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setStudents(students.map(s => 
        s.id === currentStudent.id ? {...s, status: "suspended"} : s
      ));
      setLoading(false);
      setSuspendDialogOpen(false);
      toast.success("Student account suspended");
    }, 500);
  };

  const handleActivateStudent = (student: any) => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setStudents(students.map(s => 
        s.id === student.id ? {...s, status: "active"} : s
      ));
      setLoading(false);
      toast.success("Student account activated");
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': 
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended': 
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'inactive': 
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default: 
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600">Manage student accounts and view request history</p>
          </div>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Export Student Data
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Students</CardTitle>
            <CardDescription>View and manage student accounts</CardDescription>
            <div className="pt-2">
              <Input
                placeholder="Search by name, email, ID, or department..."
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
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>{student.requestCount}</TableCell>
                      <TableCell>{new Date(student.lastActive).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">⋮</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            {student.status === 'active' ? (
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleSuspendStudent(student)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Suspend Account
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivateStudent(student)}>
                                <Users className="mr-2 h-4 w-4" />
                                Activate Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Student Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentStudent?.name || ""}
                onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={currentStudent?.email || ""}
                onChange={(e) => setCurrentStudent({...currentStudent, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                value={currentStudent?.department || ""}
                onChange={(e) => setCurrentStudent({...currentStudent, department: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Student Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Suspend Student Account</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Are you sure you want to suspend {currentStudent?.name}'s account? 
              This will prevent them from accessing the helpdesk system.
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for suspension</Label>
              <Textarea
                id="reason"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Enter reason for account suspension..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmSuspension} 
              disabled={loading || !suspensionReason.trim()}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Suspend Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default StudentManagement;
