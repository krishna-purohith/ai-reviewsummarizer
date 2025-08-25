import axios from 'axios';

export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

export type SummarizeResponse = {
   summary: string;
};

export type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

export const reviewsApi = {
   async fetchReviews(productId: number) {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   },

   async summarizeReviews(productId: number) {
      return axios
         .post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         )
         .then((res) => res.data);
   },
};
