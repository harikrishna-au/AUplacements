import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Briefcase, CheckCircle2, Loader2, X } from "lucide-react";

export default function CompanyDetailsModal({ company, isOpen, onClose, hasApplied, isApplying, onApply }) {
  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{company.name}</DialogTitle>
              <p className="text-gray-600 mt-1">{company.industry}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4 bg-white">
          {/* Description */}
          {company.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 text-sm">{company.description}</p>
            </div>
          )}

          {/* Roles */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Roles Offered</h3>
            <div className="flex flex-wrap gap-2">
              {company.rolesOffered?.map((role, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Minimum CGPA</p>
                  <p className="font-semibold text-gray-900">{company.eligibilityCriteria?.minCGPA || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Maximum Backlogs</p>
                  <p className="font-semibold text-gray-900">{company.eligibilityCriteria?.maxBacklogs ?? 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Allowed Branches</p>
                <div className="flex flex-wrap gap-2">
                  {company.eligibilityCriteria?.allowedBranches?.length > 0 ? (
                    company.eligibilityCriteria.allowedBranches.map((branch, index) => (
                      <span key={index} className="px-2 py-1 bg-white border border-gray-200 text-gray-700 text-xs rounded">
                        {branch}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-600">All Branches</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Package */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Package Details</h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-green-700 mb-1">Average Package</p>
                  <p className="font-bold text-green-900 text-xl">{company.stats?.averagePackage}</p>
                </div>
                <div>
                  <p className="text-xs text-green-700 mb-1">Highest Package</p>
                  <p className="font-bold text-green-900 text-xl">{company.stats?.highestPackage}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-4 border-t">
            {hasApplied ? (
              <Button className="w-full" disabled variant="outline" size="lg">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Already Applied
              </Button>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                onClick={() => onApply(company._id)}
                disabled={isApplying}
                size="lg"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Briefcase className="w-5 h-5 mr-2" />
                    Apply Now
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
