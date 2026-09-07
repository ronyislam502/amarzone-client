import { FolderTree } from "lucide-react"
import Link from "next/link"

const CategoriesBread = () => {
    return (
        <div className="breadcrumbs text-xs text-base-content/70">
            <ul>
                <li>
                    <Link href="/admin" className="hover:text-primary transition-colors">
                        Admin Dashboard
                    </Link>
                </li>
                <li className="font-extrabold text-base-content flex items-center gap-1">
                    <FolderTree className="w-3.5 h-3.5 text-primary" />
                    <span>Category Catalog</span>
                </li>
            </ul>
        </div>
    )
}

export default CategoriesBread;