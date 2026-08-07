'use client';

import React from 'react';
import { Star, PackageCheck, Flame } from 'lucide-react';

interface ProductItem {
    id: string;
    title: string;
    category: string;
    price: number;
    salesCount: number;
    revenue: number;
    rating: number;
    stock: number;
    image: string;
}

const TOP_PRODUCTS: ProductItem[] = [
    {
        id: 'PROD-101',
        title: 'Sony WH-1000XM5 Wireless Headphones',
        category: 'Electronics',
        price: 398.00,
        salesCount: 1420,
        revenue: 565160,
        rating: 4.9,
        stock: 84,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    },
    {
        id: 'PROD-102',
        title: 'MacBook Pro 16" M3 Max Dual-Tone',
        category: 'Computers',
        price: 2499.00,
        salesCount: 890,
        revenue: 2224110,
        rating: 5.0,
        stock: 22,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=80',
    },
    {
        id: 'PROD-103',
        title: 'Nike Air Jordan Retro High OG',
        category: 'Fashion',
        price: 180.00,
        salesCount: 2150,
        revenue: 387000,
        rating: 4.8,
        stock: 140,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
    },
    {
        id: 'PROD-104',
        title: 'Apple Watch Ultra 2 Titanium Case',
        category: 'Wearables',
        price: 799.00,
        salesCount: 1100,
        revenue: 878900,
        rating: 4.9,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
    },
];

export const TopProductsWidget: React.FC = () => {
    return (
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        <Flame className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">
                            Top Selling Products
                        </h3>
                        <p className="text-slate-400 text-xs">
                            Highest revenue generating items this month
                        </p>
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="space-y-3">
                {TOP_PRODUCTS.map((product, idx) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-amber-400/30 transition-all hover:bg-slate-800/40 group"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Rank Badge */}
                            <span className="w-5 text-center text-xs font-black text-amber-400">
                                #{idx + 1}
                            </span>

                            {/* Image */}
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                            />

                            {/* Title & Info */}
                            <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-400 transition-colors">
                                    {product.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                    <span className="badge badge-neutral badge-xs text-[9px] px-1.5 py-0.5">
                                        {product.category}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                        <Star className="w-3 h-3 fill-amber-400" />
                                        {product.rating}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-slate-400">
                                        <PackageCheck className="w-3 h-3 text-emerald-400" />
                                        {product.stock} in stock
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Revenue & Price */}
                        <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-slate-100 block">
                                ${product.revenue.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                                {product.salesCount.toLocaleString()} sold
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopProductsWidget;
