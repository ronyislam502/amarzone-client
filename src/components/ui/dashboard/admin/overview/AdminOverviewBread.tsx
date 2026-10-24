import AZBread from "@/components/shared/AZBread"
import { Layers } from "lucide-react"

const AdminOverviewBread = () => {
    return (
        <AZBread
            parentHref="/admin"
            parentLabel="Dashboard"
            title="System Overview"
            icon={<Layers className="w-3.5 h-3.5" />}
            hoverColor="hover:text-amber-400"
            className="[&_ul]:text-slate-300"
        />
    )
}

export default AdminOverviewBread;