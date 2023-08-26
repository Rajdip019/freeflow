import ReviewImage from '@/components/ImageReview/Main'
import { FeedbackContextProvider } from '@/contexts/FeedbackContext'
import React from 'react'

const Review = () => {
  return (
    <FeedbackContextProvider>
      <ReviewImage />
    </FeedbackContextProvider>
  )
}

export default Review