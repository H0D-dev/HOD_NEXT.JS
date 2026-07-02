require('dotenv').config({ path: '.env.local' });

const baseUrl = process.env.WC_BASE_URL;
const key = process.env.WC_CONSUMER_KEY;
const secret = process.env.WC_CONSUMER_SECRET;

async function run() {
  const res = await fetch(`${baseUrl}/wp-json/wc/v3/products?consumer_key=${key}&consumer_secret=${secret}&per_page=100`);
  const products = await res.json();
  
  const family = products.filter(p => {
    const acf = p.meta_data.reduce((acc, meta) => { acc[meta.key] = meta.value; return acc; }, {});
    return acf.product_family_id === 'CUR-FAM-001';
  });

  console.log(`Found ${family.length} products in CUR-FAM-001:`);
  family.forEach(p => {
    console.log(`\n- ${p.slug}`);
    console.log(`  Categories:`, p.categories.map(c => `${c.id} (${c.name})`));
  });
}
run();
