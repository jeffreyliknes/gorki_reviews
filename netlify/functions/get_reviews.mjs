import fetch from 'node-fetch';

export async function handler(event, context) {
  // Pull query parameters if needed
  const {
    page = 1,
    start = "2021-01-01",
    end = "2021-01-13",
    fromRating = 0,
    toRating = 100,
    categoryRatings = 1,
    published = 0,
    limit = 20,
  } = event.queryStringParameters || {};

  // Construct the API URL
  const apiUrl = `https://api.customer-alliance.com/reviews/v2/ca.json?page=${page}&start=${start}&end=${end}&fromRating=${fromRating}&toRating=${toRating}&categoryRatings=${categoryRatings}&published=${published}&limit=${limit}`;

  try {
    // Call the Customer Alliance API using the env var for your API key
    const response = await fetch(apiUrl, {
      headers: {
        "X-CA-AUTH": process.env.CUSTOMER_ALLIANCE_API_KEY,
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Error fetching data" }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Return a 500 if something goes wrong
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
}