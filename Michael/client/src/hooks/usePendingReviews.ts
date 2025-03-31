import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ReviewsResponse {
  pendingReviews: any[];
}

export function usePendingReviews(userId?: number) {
  const { data, isLoading } = useQuery<ReviewsResponse>({
    queryKey: ['/api/users', userId, 'review-submissions'],
    queryFn: async () => {
      if (!userId) return { pendingReviews: [] };
      return await apiRequest<ReviewsResponse>(`/api/users/${userId}/review-submissions`);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const pendingReviews = data?.pendingReviews || [];
  
  return {
    pendingReviews,
    pendingCount: pendingReviews.length,
    isLoading
  };
}