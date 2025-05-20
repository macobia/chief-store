import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import {  ChevronLeft, ChevronRight } from "lucide-react";

const customers = [
  { id: 1, name: "Alice Johnson", review: "Great service, very reliable!", stars: 5 },
  { id: 2, name: "Bob Smith", review: "Good experience overall.", stars: 4 },
  { id: 3, name: "Catherine Lee", review: "Exceptional quality and support.", stars: 5 },
  { id: 4, name: "Ahmed Musa", review: "Satisfied with the results.", stars: 4 },
  { id: 5, name: "Emma Obi", review: "Could be better in some areas.", stars: 3 },
  { id: 6, name: "Frank Wilson", review: "Fast response and helpful.", stars: 5 },
  { id: 7, name: "Grace Kim", review: "Loved the attention to detail.", stars: 5 },
  { id: 8, name: "Henry Turner", review: "Affordable and efficient.", stars: 4 },
  { id: 9, name: "Isabel Martinez", review: "From ordering to delivering... can't complain.", stars: 5 },
  { id: 10, name: "Jack Lee", review: "Will definitely buy again.", stars: 5 },
  { id: 11, name: "Femi Adewunmi", review: "Will definitely use again.", stars: 5 },
  { id: 12, name: "Phil Wilson", review: "Delivery was excellent, I love the packaging. Thank you.", stars: 5 },
];

const starsDisplay = (count) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 inline ${
          i < count ? "text-emerald-400" : "text-gray-300"
        }`}
      />
    ));
};

 function ReviewsSlider() {
  const [page, setPage] = useState(0);
  const cardsPerPage = 3;
  const maxPage = Math.floor((customers.length - 1) / cardsPerPage);

  const nextPage = () => {
    setPage((p) => (p === maxPage ? 0 : p + 1));
  };

  const prevPage = () => {
    setPage((p) => (p === 0 ? maxPage : p - 1));
  };

  const startIndex = page * cardsPerPage;
  const currentCustomers = customers.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-6">What Our Customers Say About Us</h2>

      <div className="relative">
        <div className="flex space-x-6 overflow-hidden ">
          {currentCustomers.map(({ id, name, review, stars }) => (
            <div
              key={id}
              className=" rounded-lg shadow-md p-6 flex-1 min-w-[280px] border border-emerald-500/30 bg-grey-400"
            >
              <div className="mb-2 ">{starsDisplay(stars)}</div>
              <p className=" mb-4 text-white">"{review}"</p>
              <h3 className="font-semibold text-lg text-white">{name}</h3>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevPage}
          
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-400 hover:bg-gray-300 rounded-full p-2 transition-colors duration-300"
          aria-label="Previous"
        >
         <ChevronLeft className='w-6 h-6' />
        </button>
        <button
          onClick={nextPage}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-400 hover:bg-gray-300 rounded-full p-2 transition-colors duration-300"
          aria-label="Next"
        >
         <ChevronRight className='w-6 h-6' />
        </button>
      </div>
    </div>
  );
}

export default ReviewsSlider