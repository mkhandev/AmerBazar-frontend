import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const text = await res.text();

        if (!res.ok) {
          return;
        }

        const data = JSON.parse(text);
        setCategories(data.data || data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);
  return (
    <div>
      <h1>Categories</h1>
      <div className="flex flex-row">
        {categories.map((cat) => (
          <Link className="block" key={cat.id} href="/">
            <div className="p-4 border m-0 rounded-lg hover:shadow-lg">
              <div>
                <img
                  src={cat.image}
                  alt={cat.name}
                  height="100"
                  width="100"
                  className="w-full h-auto"
                />
              </div>

              <div className="p-1">
                <h2 className="text-[12px] font-normal">{cat.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
