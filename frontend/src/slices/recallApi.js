
// slices/recallApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const recallApi = createApi({
  reducerPath: 'recallApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    // FDA Recalls with pagination
    getFdaRecalls: builder.query({
      query: ({ page = 1, limit = 10, risk, status, state, year, word }) => {
        const params = new URLSearchParams({ page, limit });
        if (risk) params.append('risk', risk);
        if (status) params.append('status', status);
        if (state) params.append('state', state);
        if (year) params.append('year', year);
        if (word) params.append('word', word);
        return `https://e4c7859f-938d-4ad8-88d4-d31220dc6f97-00-vrum1yazt5as.worf.replit.dev/api/getFda?${params.toString()}`;  
      }
    }),

    // USDA FSIS Recalls
    getFsisRecalls: builder.query({
      query: () => ({
        url: 'https://www.fsis.usda.gov/fsis/api/recall/v/1',
        method: 'GET'
      }),
      transformResponse: (response) => {
        const clean = str =>
          str
            ?.replaceAll('&#039;', "'")
            .replaceAll('&amp;', '&')
            .replaceAll('&quot;', '"')
            .replaceAll('&rsquo;', '’')
            .replaceAll('&ldquo;', '“')
            .replaceAll('&rdquo;', '”')
        return response.map(item => ({
          ...item,
          field_title: clean(item.field_title),
          field_establishment: clean(item.field_establishment)
        }))
      }
    })
  })
})

export const { useGetFdaRecallsQuery, useGetFsisRecallsQuery } = recallApi

