import fetch from "node-fetch";

export async function handler(event, context) {
  // We omit 'start' and 'end' to rely on default behavior:
  //   end = today
  //   start = 180 days before today
  // As new reviews come in, they’ll appear in this range.
  // If you need unlimited/older reviews, you can add custom 'start' or 'end' parameters.

  const apiUrl =
    "https://api.customer-alliance.com/reviews/v2/ca.json" +
    "?page=1" +
    "&limit=20" +              // number of reviews per page
    "&fromRating=0" +          // include all rating values
    "&toRating=100" +
    "&categoryRatings=1" +     // fetch category breakdown
    "&published=0";            // include non-published reviews

  try {
    // Fetch from the Customer Alliance API using your environment variable key
    const response = await fetch(apiUrl, {
      headers: {
        "X-CA-AUTH": process.env.CUSTOMER_ALLIANCE_API_KEY,
      },
    });

    // If the API returns an error status, handle gracefully
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `API request failed with status ${response.status}`,
        }),
      };
    }

    // Parse the JSON
    const data = await response.json();

    // Return the data, and allow cross-domain requests from your main site
    return {
      statusCode: 200,
      headers: {
        // If you want to allow *any* domain, use "*"
        // Otherwise specify your exact domain:
        "Access-Control-Allow-Origin": "https://www.gorkiapartments.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Catch any unexpected errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
}