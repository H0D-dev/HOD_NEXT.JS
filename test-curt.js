require('dotenv').config({ path: '.env.local' });

const baseUrl = process.env.WC_BASE_URL;
const key = process.env.WC_CONSUMER_KEY;
const secret = process.env.WC_CONSUMER_SECRET;

async function testProduct(slug) {
  const res = await fetch(`${baseUrl}/wp-json/wc/v3/products?consumer_key=${key}&consumer_secret=${secret}&slug=${slug}`);
  const data = await res.json();
  const p = data[0];
  if (!p) {
    console.log(`Product ${slug} not found`);
    return;
  }
  const acf = p.meta_data.reduce((acc, meta) => { acc[meta.key] = meta.value; return acc; }, {});
  console.log(`\n=== ${slug} ===`);
  console.log(`Family ID: '${acf.product_family_id}'`);
  console.log(`Color: '${acf.product_color}'`);
  console.log(`Categories:`, p.categories.map(c => `${c.id} (${c.name})`));
}

async function run() {
  await testProduct('blackout-curtain-1'); // Assuming this is curt-1
  await testProduct('blackout-curtain-2'); // Curt-2
  await testProduct('blackout-curtain-3'); // Curt-3
}
run();
