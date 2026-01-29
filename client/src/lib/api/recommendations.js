export const fetch_All_Recommendations = async (token) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommend/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return res.json();
};

export const fetchRecommnedation = async( {queryKey} ) => {
  const[_key , id , token] = queryKey;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommend/${id}`,
    {
      headers: {
        Authorization : `Bearer ${token}`,
      },
    }
  );

  if(!res.ok){
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch recommendation");
  }

  return res.json();
}
