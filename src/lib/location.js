export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    return data
      .map((country) => country.name.common)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchCities = async (country) => {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      }
    );
    const data = await response.json();
    return (data.data || []).sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};
