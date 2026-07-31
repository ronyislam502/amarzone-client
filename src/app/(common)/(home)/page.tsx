import React from "react";
import { Star, ShieldCheck, Truck, ArrowRight } from "lucide-react";

export default function Home() {
  const cards = [
    {
      title: "Gaming Accessories",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
      link: "See more in Gaming",
    },
    {
      title: "Deals in Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      link: "Shop all electronics",
    },
    {
      title: "Refresh Your Space",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      link: "Explore home decor",
    },
    {
      title: "Fashion & Trends",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
      link: "Discover fashion",
    },
  ];

  return (
    <div className="bg-gray-200 min-h-screen pb-16 font-sans">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-b from-[#232f3e] via-[#131921]/80 to-gray-200 pt-8 pb-32 px-4 sm:px-8 text-center text-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="badge badge-warning text-xs font-bold mb-3 px-3 py-2 uppercase tracking-wide">
            Prime Big Deal Days
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">
            Explore Great Deals on Everything You Love
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mb-6">
            Shop fast delivery, exclusive discounts, and millions of items backed by Amazon quality guarantee.
          </p>
          <div className="flex gap-3">
            <button className="btn btn-warning font-bold text-gray-900 border-none px-6">
              Shop Today&apos;s Deals
            </button>
            <button className="btn btn-outline text-white hover:bg-white hover:text-gray-900 px-6">
              Explore Prime
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card bg-white shadow-md hover:shadow-xl transition-shadow rounded-sm p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="card-title text-gray-900 text-lg font-bold mb-3">
                  {card.title}
                </h2>
                <div className="relative aspect-4/3 w-full overflow-hidden rounded mb-3 bg-gray-100">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <a
                href="#"
                className="text-xs font-medium text-blue-600 hover:text-orange-700 hover:underline flex items-center gap-1 mt-2"
              >
                {card.link} <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        {/* Feature Row / Products Spotlight */}
        <div className="mt-8 bg-white p-6 rounded-sm shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Best Sellers in Electronics
            </h2>
            <a href="#" className="text-xs font-bold text-blue-600 hover:underline">
              See more
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex flex-col items-center group cursor-pointer">
                <div className="w-28 h-28 bg-gray-100 rounded flex items-center justify-center mb-2 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80`}
                    alt="Product"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-xs text-gray-800 text-center line-clamp-2 mb-1 group-hover:text-orange-600">
                  Wireless Noise Cancelling Headphones
                </div>
                <div className="flex items-center text-amber-500 text-[10px] gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-gray-500 ml-1">4.8</span>
                </div>
                <div className="text-sm font-bold text-gray-900 mt-1">$99.99</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

