import { useRouter } from "next/router";

interface Order {
  order_id: string;
  buyer_id: string;
  total_amount: number;
  status: string;
}

export default async function OrdersWrapper(props: { params: Promise<{ buyer_id: string }> }) {

    const params =  await props.params;
    const id = params.buyer_id;
    
    const res = await fetch(`/api/orders/cancel`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyer_id: id }),
    });
    const orderList: Order[] = await res.json();

    return (
        <>
        {orderList?.map((order) => {
            return <Order key={order.order_id} order={order} />;
        })}
        </>
    );
}

export function Order({ order }: { order: Order }) {
  const router = useRouter();

  const handleCancel = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/orders/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.order_id }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/account");
      } else {
        throw new Error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Order #: {order.order_id}</h2>
      <p>Total: {order.total_amount}</p>
      {order.status === "pending" && (
        <button onClick={handleCancel}>Cancel Order</button>
      )}
    </div>
  );
}
