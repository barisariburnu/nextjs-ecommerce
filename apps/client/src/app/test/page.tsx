import { auth } from "@clerk/nextjs/server";

const OrdersPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  console.log(token);

  const resProduct = await fetch("http://localhost:8000/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dataProduct = await resProduct.json();
  console.log(dataProduct);

  const resOrder = await fetch("http://localhost:8001/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dataOrder = await resOrder.json();
  console.log(dataOrder);

  const resPayment = await fetch("http://localhost:8002/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dataPayment = await resPayment.json();
  console.log(dataPayment);

  return (
    <div className="w-full h-full flex items-center justify-center mt-16">
      <h1 className="text-2xl font-medium">Test</h1>
    </div>
  );
};

export default OrdersPage;
