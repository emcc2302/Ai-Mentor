export const getAIVideo = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/ai/generate-video`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  console.log("STATUS:", response.status);
console.log("URL:", response.url);

  let data;

  try {
    data = await response.json();
  } catch (err) {
    throw new Error("Server returned empty or invalid JSON");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};