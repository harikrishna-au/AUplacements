import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import CompanyLogo from './CompanyLogo';

export default function PipelineCard({ application }) {
  const getStageStatus = (stageNumber) => {
    if (application.status === 'rejected' && stageNumber > application.currentStage) {
      return 'failed';
    }
    if (stageNumber < application.currentStage) return 'completed';
    if (stageNumber === application.currentStage) return 'current';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-blue-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-6 h-6" />;
      case 'current': return <Clock className="w-6 h-6" />;
      case 'failed': return <XCircle className="w-6 h-6" />;
      default: return <Circle className="w-6 h-6" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'applied': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'selected': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 hover:bg-white/80 transition-all">
      <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CompanyLogo 
              logo={application.companyId?.logo} 
              companyName={application.companyId?.name}
              size="lg"
            />
            <div>
              <CardTitle className="text-2xl">
                {application.companyId?.name || 'Unknown Company'}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Applied on {new Date(application.appliedDate).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusBadge(application.status)}`}>
            {application.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-8 pb-8">
        {/* Pipeline Stages */}
        <div className="relative">
          <div className="flex justify-between items-center">
            {application.companyId?.recruitmentStages?.map((stage, index) => {
              const stageNumber = stage.order;
              const status = getStageStatus(stageNumber);
              const StatusIcon = getStatusIcon(status);

              return (
                <div key={stage._id || index} className="flex items-center">
                  <div className="flex flex-col items-center z-10 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(status)} transition-all duration-300`}>
                      {StatusIcon}
                    </div>
                    <div className="mt-3 text-center max-w-[120px]">
                      <p className={`text-sm font-semibold ${
                        status === 'current' ? 'text-blue-600' : 
                        status === 'completed' ? 'text-green-600' :
                        status === 'failed' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stage.stageName}
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < application.companyId.recruitmentStages.length - 1 && (
                    <div className={`flex-1 mx-4 border-t-4 border-dashed transition-all duration-300 ${
                      stageNumber < application.currentStage ? 'border-green-500' :
                      stageNumber === application.currentStage ? 'border-blue-500' : 'border-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Outcome for Selected */}
        {application.status === 'selected' && application.outcome?.package && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-900">Offer Details</h4>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              {application.outcome.package && (
                <div>
                  <p className="text-sm text-green-700">Package</p>
                  <p className="font-semibold text-green-900">{application.outcome.package}</p>
                </div>
              )}
              {application.outcome.role && (
                <div>
                  <p className="text-sm text-green-700">Role</p>
                  <p className="font-semibold text-green-900">{application.outcome.role}</p>
                </div>
              )}
              {application.outcome.joiningDate && (
                <div>
                  <p className="text-sm text-green-700">Joining Date</p>
                  <p className="font-semibold text-green-900">
                    {new Date(application.outcome.joiningDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
