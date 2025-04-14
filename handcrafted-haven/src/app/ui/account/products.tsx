import Image from "next/image";
import { fetchProductList } from "@/app/ui/sellers/actions";
import { useRouter } from "next/router";

interface Product {
  product_id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: [string];
}

export default async function ProductsWrapper(props: {
  params: Promise<{ user_id: string }>;
}) {
  const params = await props.params;
  const id = params.user_id;

  const allProductsList = await fetchProductList();
  console.log(allProductsList);
  const userProductsList: Product[] = [];
  allProductsList.forEach((product: Product) => {
    if (product.user_id == id) {
      userProductsList.push(product);
    }
  });
  console.log(userProductsList);

  return (
    <>
      {userProductsList?.map((product) => {
        return <Product key={product.product_id} product={product} />;
      })}
    </>
  );
}

export function Product({ product }: { product: Product }) {
  const imageAlt = `${product.description}`;
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.product_id }),
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
      <Image src={product.images[0]} alt={imageAlt} height={400} width={200} />
      <h2>{product.title}</h2>
      <p>Price: {product.price}</p>
      <p>Category: {product.category}</p>
      <p>Description: {product.description}</p>
      <button onClick={handleDelete}>Delete Product</button>
    </div>
  );
}
