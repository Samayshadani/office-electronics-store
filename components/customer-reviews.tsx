"use client"

import { useState } from "react"
import { Star, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Review {
  id: number
  name: string
  date: string
  verified: boolean
  rating: number
  title: string
  content: string
  helpful: number
  images?: string[]
}

interface CustomerReviewsProps {
  reviews: Review[]
  rating: number
  totalReviews: number
}

export function CustomerReviews({ reviews, rating, totalReviews }: CustomerReviewsProps) {
  const [helpfulReviews, setHelpfulReviews] = useState<number[]>([])
  const [expandedReviews, setExpandedReviews] = useState<number[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)

  const ratingCounts = [
    { stars: 5, count: Math.round(totalReviews * 0.68) },
    { stars: 4, count: Math.round(totalReviews * 0.22) },
    { stars: 3, count: Math.round(totalReviews * 0.07) },
    { stars: 2, count: Math.round(totalReviews * 0.02) },
    { stars: 1, count: Math.round(totalReviews * 0.01) },
  ]

  const toggleHelpful = (reviewId: number) => {
    setHelpfulReviews((prev) => {
      if (prev.includes(reviewId)) {
        return prev.filter((id) => id !== reviewId)
      }
      return [...prev, reviewId]
    })
  }

  const toggleExpanded = (reviewId: number) => {
    setExpandedReviews((prev) => {
      if (prev.includes(reviewId)) {
        return prev.filter((id) => id !== reviewId)
      }
      return [...prev, reviewId]
    })
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  return (
    <Card>
      <CardContent className="p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
              <div className="flex justify-center items-center mb-2">
                <div className="text-5xl font-bold text-gray-900 mr-3">{rating.toFixed(1)}</div>
                <div className="flex flex-col items-start">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Based on {totalReviews} reviews</div>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-3">
              {ratingCounts.map((rc) => (
                <div key={rc.stars} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">{rc.stars} stars</div>
                  <div className="flex-1 mx-3">
                    <Progress value={(rc.count / totalReviews) * 100} className="h-2" />
                  </div>
                  <div className="w-10 text-sm text-right text-gray-600">{rc.count}</div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Button variant="outline" className="w-full">
                Write a Review
              </Button>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {displayedReviews.map((review) => {
                const isExpanded = expandedReviews.includes(review.id)
                const isLongReview = review.content.length > 250
                return (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-1">{review.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">By {review.name}</p>

                    <div className="text-gray-700">
                      {isLongReview && !isExpanded ? (
                        <>
                          <p>{review.content.slice(0, 250)}...</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 text-orange-600 hover:text-orange-700 p-0 h-auto font-normal"
                            onClick={() => toggleExpanded(review.id)}
                          >
                            Read more
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </>
                      ) : isLongReview ? (
                        <>
                          <p>{review.content}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 text-orange-600 hover:text-orange-700 p-0 h-auto font-normal"
                            onClick={() => toggleExpanded(review.id)}
                          >
                            Show less
                            <ChevronUp className="h-4 w-4 ml-1" />
                          </Button>
                        </>
                      ) : (
                        <p>{review.content}</p>
                      )}
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img || "/placeholder.svg"}
                            alt={`Review image ${idx + 1}`}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}

                    {/* Helpful Button */}
                    <div className="flex items-center mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-sm flex items-center ${
                          helpfulReviews.includes(review.id) ? "text-orange-600" : "text-gray-500"
                        }`}
                        onClick={() => toggleHelpful(review.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)})
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {reviews.length > 3 && (
              <div className="text-center mt-6">
                <Button variant="outline" onClick={() => setShowAllReviews(!showAllReviews)} className="px-8">
                  {showAllReviews ? "Show Less Reviews" : `View All ${reviews.length} Reviews`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
