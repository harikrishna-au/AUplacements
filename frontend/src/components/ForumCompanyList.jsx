import { Card } from "@/components/ui/card";
import CompanyLogo from './CompanyLogo';

export default function ForumCompanyList({ forums, selectedCompany, onCompanySelect }) {
  return (
    <Card className="p-3">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {forums.map((forum) => (
          <button
            key={forum.companyId}
            onClick={() => onCompanySelect(forum)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              selectedCompany?.companyId === forum.companyId
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <CompanyLogo logo={forum.companyLogo} name={forum.companyName} size="sm" />
            <span className="font-semibold text-sm">{forum.companyName}</span>
            {forum.hasApplied && !forum.isGeneral && (
              <span className={`text-xs ${
                selectedCompany?.companyId === forum.companyId ? 'text-green-200' : 'text-green-600'
              }`}>✓</span>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
}
