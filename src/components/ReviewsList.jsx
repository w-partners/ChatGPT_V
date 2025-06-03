import React from 'react';

const ReviewsList = ({ reviews }) => {
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="font-semibold">평점 및 리뷰</h3>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-800 mr-2">{averageRating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <span className="ml-2 text-gray-600">총 {reviews.length}개의 리뷰</span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {reviews.map((review, index) => (
          <div key={index} className="py-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="font-medium">{review.user}</span>
                <div className="flex items-center ml-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{review.rating}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;