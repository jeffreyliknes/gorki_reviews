import fetch from "node-fetch";

export async function handler(event, context) {
  // Build a query string with minimal filters and a wide date range.
  // This will show up to 20 reviews from 2020-01-01 through 2025-12-31,
  // ignoring whether they're published or not.
  // If your property has more than 20 reviews, use a higher 'limit' 
  // or multiple pages.
  const apiUrl = 
    "https://api.customer-alliance.com/reviews/v2/ca.json" +
    "?page=1" +
    "&fromRating=0" +
    "&toRating=100" +
    "&categoryRatings=1" +
    "&published=0" +
    "&start=2020-01-01" +
    "&end=2025-12-31" +
    "&limit=20";

  try {
    // Call the Customer Alliance API, injecting your key from Netlify env vars
    const response = await fetch(apiUrl, {
      headers: {
        "X-CA-AUTH": process.env.CUSTOMER_ALLIANCE_API_KEY,
      },
    });

    // If the API responds with an error (e.g., 401, 404), handle it gracefully
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `API request failed with status ${response.status}`,
        }),
      };
    }

    // Parse the JSON data
    const data = await response.json();

    // Return data in the function response
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Return an error if something unexpected occurs
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
}