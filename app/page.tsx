"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://161.248.189.58/~mkhandev/myapp/public/api/v1/categories")
      .then(async (res) => {
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Categories</h1>
    </div>
  );
}
