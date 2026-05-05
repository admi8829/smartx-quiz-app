export const onRequest: PagesFunction = async (context) => {
  return new Response(JSON.stringify({
    status: "ok",
    message: "Smart X Academy API is online",
    timestamp: new Date().toISOString()
  }), {
    headers: { "Content-Type": "application/json" }
  });
};
