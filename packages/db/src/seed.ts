async function main() {
  console.log("ok");
}

main().catch((e) => {
  console.error("Seed failed");
  console.error(e);
  process.exit(1);
});
