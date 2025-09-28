import { auth } from "@clerk/nextjs/server";

const OrdersPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  console.log(token);

  return (
    <div className="w-full h-full flex items-center justify-center mt-16">
      <h1 className="text-2xl font-medium">Test</h1>
    </div>
  );
};

export default OrdersPage;
