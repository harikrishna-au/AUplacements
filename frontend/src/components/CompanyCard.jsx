import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Loader2, Briefcase, Info } from "lucide-react";
import CompanyLogo from './CompanyLogo';

export default function CompanyCard({ company, hasApplied, isApplying, onApply, onViewDetails }) {
  const formatBranches = (branches) => {
    if (!branches || branches.length === 0) return 'All Branches';
    if (branches.length <= 2) return branches.join(', ');
    return `${branches.slice(0, 2).join(', ')} +${branches.length - 2}`;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 hover:bg-white/80 transition-all duration-200">
      <CardHeader>
        <div className="flex items-start gap-3">
          <CompanyLogo 
            logo={company.logo}
            companyName={company.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">{company.name}</CardTitle>
            <CardDescription className="text-sm">{company.industry}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Roles */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Roles</p>
          <div className="flex flex-wrap gap-2">
            {company.rolesOffered?.slice(0, 3).map((role, index) => (
              <span key={index} className="px-2 py-1 bg-indigo-500/10 text-indigo-700 text-xs rounded-xl font-medium">
                {role}
              </span>
            ))}
            {company.rolesOffered?.length > 3 && (
              <span className="px-2 py-1 bg-gray-500/10 text-gray-600 text-xs rounded-xl">
                +{company.rolesOffered.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-gray-500/5 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-gray-700 mb-2">Eligibility</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">CGPA:</span> {company.eligibilityCriteria?.minCGPA || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Backlogs:</span> {company.eligibilityCriteria?.maxBacklogs ?? 'N/A'}
            </div>
          </div>
          <div className="text-xs text-gray-600 pt-1">
            <span className="font-medium">Branches:</span> {formatBranches(company.eligibilityCriteria?.allowedBranches)}
          </div>
        </div>

        {/* Package */}
        <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20">
          <p className="text-xs text-green-700 font-medium mb-1">Package Range</p>
          <p className="font-bold text-green-900 text-lg">
            {company.stats?.averagePackage} - {company.stats?.highestPackage}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={() => onViewDetails(company)}
          >
            <Info className="w-4 h-4 mr-2" />
            More Details
          </Button>
          
          {hasApplied ? (
            <Button className="w-full rounded-xl" disabled variant="outline">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Applied
            </Button>
          ) : (
            <Button 
              className="w-full bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700" 
              onClick={() => onApply(company._id)}
              disabled={isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
