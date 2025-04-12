"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/ui/products-page/loading";
import ProductsWrapper from "@/app/ui/account/products";
import AddProductForm from "@/app/ui/account/ProductForm";
import OrdersWrapper from "@/app/ui/account/orders";

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

      {userData?.role === "seller" && (
        <div>
          <h2>Product Management</h2>
          <ProductsWrapper params={Promise.resolve({ user_id: userData?.user_id.toString() || "" })} />
          <AddProductForm params={Promise.resolve({ user_id: userData?.user_id?.toString() || "" })} />
        </div>
      )}
      {userData?.role === "seller" && (
        <div>
          <h2>Your Purchase History</h2>
          <OrdersWrapper params={Promise.resolve({ buyer_id: userData?.user_id.toString() || "" })}/>
        </div>
      )}
      
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
