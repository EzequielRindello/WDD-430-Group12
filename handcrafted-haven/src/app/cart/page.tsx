"use client";

import CartList from "@/app/ui/cart/cartList";
import { calculateCartTotal } from "../ui/cart/actions";
import { useRouter } from "next/navigation";
import Loading from "../ui/products-page/loading";
import { useEffect, useState } from "react";
import styles from "../ui/cart/CartList.module.css";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  console.log(email);

  const fetchTotal = async () => {
    const total = await calculateCartTotal();
    setTotal(total);
  };

  useEffect(() => {
    const storedIsLogged = localStorage.getItem("isLogged");
    const storedEmail = localStorage.getItem("userMail");

    if (!storedIsLogged || !storedEmail) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "You need to log in to access your cart.",
      });
      router.push("/login");
      return;
    }

    setIsLogged(true);
    setEmail(storedEmail);
    setIsClient(true);

    fetchTotal();
  }, [router]);

  const deleteList = () => {
    localStorage.setItem("haven-cart", JSON.stringify([]));
    setTotal(0);
  };

  if (!isClient || !isLogged) return <Loading />;

  if (total === 0) {
    return (
      <div className={styles.wrapper}>
        <h1>Your cart is empty</h1>
        <img
          src="/images/empty-cart.png"
          alt="Empty Cart"
          className={styles.emptyCartImage}
        />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1>My Cart</h1>
      <CartList onCartUpdate={fetchTotal} />
      <div>
        <h3 className={styles.cartTotal}>Total: ${total.toFixed(2)}</h3>
        <button className={styles.deleteCartButton} onClick={deleteList}>
          Delete List
        </button>
      </div>
    </div>
  );
}
