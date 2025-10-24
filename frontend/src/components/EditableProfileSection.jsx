import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditableProfileSection({ 
  title, 
  description, 
  fields, 
  studentData, 
  formData, 
  onChange,
  isEditing 
}) {
  
  const branches = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Instrumentation Engineering',
    'Metallurgical Engineering',
    'Other'
  ];

  const courses = ['B.Tech', 'B.E', 'M.Tech', 'MCA', 'Other'];
  
  const genders = ['Male', 'Female', 'Other'];
  
  const booleanOptions = ['Yes', 'No'];

  const handleInputChange = (key, value) => {
    onChange(key, value);
  };

  const renderField = (field) => {
    const value = isEditing ? (formData[field.key] ?? '') : (studentData?.[field.key] || 'N/A');

    // Dropdown fields
    if (isEditing && field.key === 'branch') {
      return (
        <Select value={formData[field.key] || ''} onValueChange={(val) => handleInputChange(field.key, val)}>
          <SelectTrigger className="bg-white/50 rounded-xl">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (isEditing && field.key === 'course') {
      return (
        <Select value={formData[field.key] || ''} onValueChange={(val) => handleInputChange(field.key, val)}>
          <SelectTrigger className="bg-white/50 rounded-xl">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course} value={course}>{course}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (isEditing && field.key === 'gender') {
      return (
        <Select value={formData[field.key] || ''} onValueChange={(val) => handleInputChange(field.key, val)}>
          <SelectTrigger className="bg-white/50 rounded-xl">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            {genders.map((gender) => (
              <SelectItem key={gender} value={gender}>{gender}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (isEditing && (field.key === 'completedInTime' || field.key === 'hasPAN' || field.key === 'hasPassport' || field.key === 'hasLaptop' || field.key === 'hasInternet')) {
      return (
        <Select value={formData[field.key] || ''} onValueChange={(val) => handleInputChange(field.key, val)}>
          <SelectTrigger className="bg-white/50 rounded-xl">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {booleanOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Textarea
    if (field.type === 'textarea') {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          disabled={!isEditing}
          className="bg-white/50 rounded-xl"
          rows={2}
        />
      );
    }

    // Regular input
    return (
      <Input
        value={value}
        onChange={(e) => handleInputChange(field.key, e.target.value)}
        disabled={!isEditing}
        className="bg-white/50 rounded-xl"
      />
    );
  };

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 ${fields.length > 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
          {fields.map((field) => (
            <div key={field.id} className={`space-y-2 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
              <p className="text-sm font-medium text-gray-700">{field.label}</p>
              {renderField(field)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
