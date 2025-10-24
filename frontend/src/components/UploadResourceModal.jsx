import { useState } from 'react';

const INITIAL_FORM_DATA = {
  companyId: '',
  title: '',
  description: '',
  resourceType: 'pdf',
  category: 'Interview Prep',
  externalUrl: ''
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { resourceAPI } from '../services/api';
import toast from '@/components/ui/toast';

export default function UploadResourceModal({ isOpen, onClose, companies, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyId || !formData.title || !formData.externalUrl) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await resourceAPI.contributeResource(formData);
      
  toast.success('Resource submitted successfully! It will be reviewed before publishing.');
  onSuccess?.();
  handleClose();
    } catch (err) {
      console.error('Error uploading resource:', err);
      setError(err.response?.data?.message || 'Failed to upload resource');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ ...INITIAL_FORM_DATA });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>
            Share study materials, guides, or resources with your peers. Your contribution will be reviewed before publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white">
          <div>
            <Label htmlFor="company">Company *</Label>
            <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {(companies || []).filter(c => c.id !== 'all').map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Coding Interview Questions"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of the resource"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resourceType">Resource Type</Label>
              <Select value={formData.resourceType} onValueChange={(value) => setFormData({...formData, resourceType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Link/URL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interview Prep">Interview Prep</SelectItem>
                  <SelectItem value="Coding Practice">Coding Practice</SelectItem>
                  <SelectItem value="Aptitude Tests">Aptitude Tests</SelectItem>
                  <SelectItem value="Resume Building">Resume Building</SelectItem>
                  <SelectItem value="Company Info">Company Info</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="url">Resource URL *</Label>
            <Input
              id="url"
              type="url"
              value={formData.externalUrl}
              onChange={(e) => setFormData({...formData, externalUrl: e.target.value})}
              placeholder="https://drive.google.com/... or https://youtube.com/..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a Google Drive link, YouTube link, or any publicly accessible URL
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
