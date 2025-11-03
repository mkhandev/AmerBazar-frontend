import Rating from "@/components/Product/Rating";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { ProductReview } from "@/types/products";
import { Calendar, User } from "lucide-react";
import React from "react";

function ReviewList({ reviews }: { reviews?: ProductReview[] }) {
  return (
    <div className="space-y-4">
      {reviews?.length === 0 && <div>No reviews yet</div>}

      <div className="flex flex-col gap-3">
        {reviews?.map((review) => (
          <Card key={review.id} className="rounded-none shadow-none border">
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.comment}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={Number(review.rating)} />
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {review.user ? review.user.name : "User"}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDateTime(new Date(review.created_at)).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;
