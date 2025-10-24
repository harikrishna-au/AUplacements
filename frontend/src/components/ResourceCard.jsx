import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  BookOpen,
  Download,
  ExternalLink,
  Star,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResourceCard({ resource, onDownload, onView }) {
  if (!resource) return null;

  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'link':
      case 'url':
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes == null) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 hover:bg-white/80 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 md:gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              {getResourceIcon(resource?.resourceType)}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {resource?.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {resource?.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">{resource?.resourceType}</span>
                      {resource?.fileSize && (
                        <span>• {formatFileSize(resource?.fileSize)}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {resource?.downloads || 0} downloads
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {resource?.views || 0} views
                    </div>
                    
                    {resource?.rating?.average > 0 && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {resource?.rating?.average.toFixed(1)}
                        <span className="ml-1">({resource?.rating?.count})</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Uploaded by {resource?.uploadedBy?.fullName || 'Unknown'} • {formatDate(resource?.createdAt)}
                  </div>
                </div>

                <div>
                  <span className="inline-block bg-gray-500/10 text-gray-700 px-3 py-1 rounded-xl text-xs font-medium">
                    {resource?.category || 'General'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4">
                {(resource?.fileUrl || resource?.externalUrl) && (
                  <Button
                    onClick={() => onDownload?.(resource)}
                    size="sm"
                    className="bg-teal-600 rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700"
                  >
                    {resource?.resourceType === 'link' || resource?.resourceType === 'url' ? (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Link
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                )}
                
                {resource?.externalUrl && resource?.resourceType === 'video' && (
                  <Button
                    onClick={() => onView?.(resource)}
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Watch
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
