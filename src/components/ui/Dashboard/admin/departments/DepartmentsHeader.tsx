import { Download, Sparkles } from "lucide-react";

export interface DepartmentsHeaderProps {
    onExportCsv?: () => void;
}

const DepartmentsHeader = ({ onExportCsv }: DepartmentsHeaderProps) => {
    return (
        <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="badge badge-primary gap-1 px-3 py-2 text-xs font-black shadow">
                            <Sparkles className="w-3.5 h-3.5" />
                            Enterprise Architecture
                        </span>
                        <span className="badge badge-success badge-outline gap-1 font-bold text-xs">
                            <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                            Live Department Taxonomy
                        </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight">
                        Departments <span className="text-primary">Management</span>
                    </h1>
                    <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
                        Define top-level business departments, structure taxonomy hierarchies, govern catalog segregation, and maintain operational clarity.
                    </p>
                </div>

                {/* DaisyUI Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={onExportCsv}
                        className="btn btn-outline btn-sm gap-2 cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DepartmentsHeader;
