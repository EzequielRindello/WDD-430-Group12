"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../ui/products-page/loading";
import ProductsWrapper from "../ui/sellers/products";

type User = {
  user_id: number;
  username: string;
  email: string;
  role: "seller" | "buyer";
};

export default function Page() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged");
    const email = localStorage.getItem("userMail");

    if (!isLogged || !email) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/login/${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("user not found");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error while loading the user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Bienvenido, {userData?.username}</h1>
      <p>Correo: {userData?.email}</p>
      <p>Rol: {userData?.role === "seller" ? "Seller" : "Buyer"}</p>

      <div>
      <h2>Product Management</h2>
      <ProductsWrapper params={Promise.resolve({ user_id: userData?.user_id.toString() || "" })} />
      <AddProductForm />
      </div>
      

      <button
        onClick={() => {
          localStorage.removeItem("isLogged");
          localStorage.removeItem("userMail");
          router.push("/login");
        }}
      >
        Log Out
      </button>
    </div>
  );
}
