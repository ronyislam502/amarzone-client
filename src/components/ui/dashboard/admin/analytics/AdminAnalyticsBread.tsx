import AZBread from "@/components/shared/AZBread";
import { TrendingUp } from "lucide-react";

const AdminAnalyticsBread = () => {
    return (
        <AZBread
            parentHref="/admin"
            parentLabel="Dashboard"
            title="Sales Analytics"
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            hoverColor="hover:text-amber-400"
            className="[&_ul]:text-slate-300"
        />
    );
};

export default AdminAnalyticsBread;