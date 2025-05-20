import React from "react";
import { GlobeAltIcon, TagIcon } from "@heroicons/react/24/solid";

function InfoCards() {
  return (
    <div className="lg:flex justify-center space-x-8 p-6">
      {/* Card 1: Flutterwave */}
      <div className="bg-gray-700 flex items-center space-x-4 rounded-lg shadow-md p-4 min-w-[300px] mb-6">
        {/* Flutterwave logo placeholder */}
        <img
          src="flutterwave-icon.png"
          alt="Flutterwave Logo"
          className="w-12 h-12"
        />
        <div>
          <h2 className="text-lg font-semibold mb-2 text-white">Powered by Flutterwave</h2>
          <p className="text-emerald-300 font-medium mb-4">Safe and secure payment</p>
        </div>
      </div>

      {/* Card 2: Worldwide delivery */}
      <div className="bg-gray-700 flex items-center space-x-4 rounded-lg shadow-md p-4 min-w-[300px] mb-6">
        <GlobeAltIcon className="w-12 h-12 text-blue-500" />
        <div>
          <h2 className="text-xl font-semibold">Worldwide Delivery</h2>
          <p className="text-emerald-300 font-medium mb-4">Fast, safe, and tracked</p>
        </div>
      </div>

      {/* Card 3: Discount */}
      <div className="bg-gray-700 flex items-center space-x-4 rounded-lg shadow-md p-4 min-w-[300px] mb-6">
        <TagIcon className="w-12 h-12 text-green-500" />
        <div>
          <h2 className="text-xl font-semibold">10% Discount on Purchase</h2>
          <p className="text-emerald-300 font-medium mb-4">Discount applied on eligible products</p>
        </div>
      </div>
    </div>
  );
}
export default InfoCards;
