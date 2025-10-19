import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileSection({ title, description, fields, studentData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 ${fields.length > 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
          {fields.map((field) => (
            <div key={field.id} className={`space-y-2 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
              <p className="text-sm font-medium text-gray-700">{field.label}</p>
              {field.type === 'textarea' ? (
                <Textarea
                  value={studentData?.[field.key] || 'N/A'}
                  disabled
                  className="bg-muted"
                  rows={2}
                />
              ) : (
                <Input
                  value={studentData?.[field.key] || 'N/A'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
