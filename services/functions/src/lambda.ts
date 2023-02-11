export const handler = async () => {
  console.log("Hello world!");
  return {
    hello: "world",
    time: new Date().toString(),
  };
};
