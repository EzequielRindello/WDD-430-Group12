'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function AddProductForm({ params }: { params: Promise<{ user_id: string }> }) {
  const [formData, setFormData] = useState<{
    title: string;
    price: string;
    images: string[];
    category: string;
    description: string;
    user_id: string;
  }>({
    title: "",
    price: "",
    images: [],
    category: "",
    description: "",
    user_id: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      const paramData = await params;
      setFormData((prevState) => ({
        ...prevState,
        user_id: paramData.user_id,
      }));
    };
    fetchParams();
  }, [params]);

 const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("isLogged", "true");
      router.push("/account");
    } else {
      setError(data.message || "Failed to add product");
    }
  };

  function handleImageInput(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter" && event.currentTarget.value.trim() !== "") {
      formData.images.push(event.currentTarget.value.trim());
      event.currentTarget.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Product Name:
        <input
          onChange={handleChange}
          name="title"
          type="text"
          required
        />
      </label>
      <label>
        Price:
        <input
          onChange={handleChange}
          name="price"
          type="number"
          defaultValue="10.99"
          required
        />
      </label>
      <label>
        Image URL:
        <input
          name="image"
          type="url"
          onKeyUp={handleImageInput}
        />
      </label>
      <ul>
        {formData.images.map((image, index) => (
          <li key={index}>{image}</li>
        ))}
      </ul>
      <label>
        Category:
        <select
          onChange={handleChange}
          name="category"
          required
        >
          <option value="">Choose a Category</option>
          <option value="Art">Artwork</option>
          <option value="Furniture">Furniture</option>
          <option value="Ceramics">Ceramics</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Textiles">Textiles</option>
        </select>
      </label>
      <label>
        Description:
        <input
          onChange={handleChange}
          name="description"
          type="text"
          required
        />
      </label>
      <input
        type="hidden"
        name="user_id"
        value={formData.user_id}
        required
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Add Product</button>
    </form>
  );
}