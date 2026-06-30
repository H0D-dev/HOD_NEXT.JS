require('dotenv').config({ path: '.env.production' });
const fs = require('fs');
const path = require('path');

const WC_BASE_URL = process.env.WC_BASE_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
const authHeader = {
  'Authorization': `Basic ${auth}`
};

// Map of SKU to local public images
const skuImageMap = {
  'RUG-TST-01': ['public/rugs/set1-room.png', 'public/rugs/set1-full.png'],
  'RUG-TST-02': ['public/rugs/set2-room.png', 'public/rugs/set2-full.png'],
  'RUG-TST-03': ['public/rugs/set3-room.png', 'public/rugs/set3-full.png'],
  'RUG-TST-04': ['public/rugs/set1-room.png', 'public/rugs/set1-texture.png'],
  'RUG-TST-05': ['public/rugs/set2-room.png', 'public/rugs/set2-texture.png'],
  'CUR-TST-01': ['public/curtains/set1-room.png', 'public/curtains/set1-full.png'],
  'CUR-TST-02': ['public/curtains/set2-room.png', 'public/curtains/set2-full.png'],
  'CUR-TST-03': ['public/curtains/set3-room.png', 'public/curtains/set3-full.png'],
  'CUR-TST-04': ['public/curtains/set1-room.png', 'public/curtains/set1-texture.png'],
  'CUR-TST-05': ['public/curtains/set2-room.png', 'public/curtains/set2-texture.png'],
};

const productsData = [
  { sku: 'RUG-TST-01', name: 'Modern Wool Rug 1', desc: 'Premium hand-tufted modern rug.', regular_price: '799', sale_price: '699', stock: 10, weight: '18', length: '350', width: '250', height: '2', cats: ['Rugs', 'Modern'], images: ['https://picsum.photos/id/101/800/800.jpg', 'https://picsum.photos/id/102/800/800.jpg'], meta: { design_id: 'RUG-DES-001', item_number: 'HOD-RUG-001', construction: 'Hand Tufted', country_of_origin: 'Turkey', pet_friendly: '1', washable: '0', care_instructions: 'Vacuum regularly', exact_width_cm: '250', exact_length_cm: '350', weight_kg: '18' } },
  { sku: 'RUG-TST-02', name: 'Luxury Persian Rug 2', desc: 'Classic Persian silk blend rug.', regular_price: '1299', sale_price: '', stock: 5, weight: '15', length: '300', width: '200', height: '1', cats: ['Rugs', 'Persian', 'Luxury'], images: ['https://picsum.photos/id/103/800/800.jpg', 'https://picsum.photos/id/104/800/800.jpg'], meta: { design_id: 'RUG-DES-002', item_number: 'HOD-RUG-002', construction: 'Hand Knotted', country_of_origin: 'Iran', pet_friendly: '0', washable: '0', care_instructions: 'Professional clean only', exact_width_cm: '200', exact_length_cm: '300', weight_kg: '15' } },
  { sku: 'RUG-TST-03', name: 'Modern Jute Rug 3', desc: 'Eco-friendly natural jute rug.', regular_price: '499', sale_price: '399', stock: 20, weight: '12', length: '250', width: '150', height: '3', cats: ['Rugs', 'Modern'], images: ['https://picsum.photos/id/106/800/800.jpg', 'https://picsum.photos/id/107/800/800.jpg'], meta: { design_id: 'RUG-DES-003', item_number: 'HOD-RUG-003', construction: 'Woven', country_of_origin: 'India', pet_friendly: '1', washable: '1', care_instructions: 'Spot clean', exact_width_cm: '150', exact_length_cm: '250', weight_kg: '12' } },
  { sku: 'RUG-TST-04', name: 'Luxury Shag Rug 4', desc: 'Deep pile luxury shag rug.', regular_price: '899', sale_price: '750', stock: 8, weight: '22', length: '400', width: '300', height: '5', cats: ['Rugs', 'Luxury'], images: ['https://picsum.photos/id/108/800/800.jpg', 'https://picsum.photos/id/109/800/800.jpg'], meta: { design_id: 'RUG-DES-004', item_number: 'HOD-RUG-004', construction: 'Machine Made', country_of_origin: 'Turkey', pet_friendly: '1', washable: '0', care_instructions: 'Vacuum without beater bar', exact_width_cm: '300', exact_length_cm: '400', weight_kg: '22' } },
  { sku: 'RUG-TST-05', name: 'Persian Runner 5', desc: 'Long hallway Persian runner.', regular_price: '599', sale_price: '', stock: 12, weight: '8', length: '400', width: '80', height: '1', cats: ['Rugs', 'Persian'], images: ['https://picsum.photos/id/110/800/800.jpg', 'https://picsum.photos/id/111/800/800.jpg'], meta: { design_id: 'RUG-DES-005', item_number: 'HOD-RUG-005', construction: 'Hand Knotted', country_of_origin: 'Iran', pet_friendly: '0', washable: '0', care_instructions: 'Professional clean', exact_width_cm: '80', exact_length_cm: '400', weight_kg: '8' } },
  { sku: 'CUR-TST-01', name: 'Blackout Curtain 1', desc: 'Heavy thermal blackout curtains.', regular_price: '249', sale_price: '199', stock: 30, weight: '4', length: '250', width: '140', height: '2', cats: ['Curtains', 'Blackout'], images: ['https://picsum.photos/id/112/800/800.jpg', 'https://picsum.photos/id/113/800/800.jpg'], meta: { design_id: 'CUR-DES-001', item_number: 'HOD-CUR-001', construction: 'Woven', country_of_origin: 'China', pet_friendly: '1', washable: '1', care_instructions: 'Machine wash cold', exact_width_cm: '140', exact_length_cm: '250', weight_kg: '4' } },
  { sku: 'CUR-TST-02', name: 'Sheer Linen Curtain 2', desc: 'Light airy sheer linen curtains.', regular_price: '149', sale_price: '', stock: 50, weight: '1', length: '220', width: '140', height: '1', cats: ['Curtains', 'Sheer'], images: ['https://picsum.photos/id/114/800/800.jpg', 'https://picsum.photos/id/115/800/800.jpg'], meta: { design_id: 'CUR-DES-002', item_number: 'HOD-CUR-002', construction: 'Woven', country_of_origin: 'India', pet_friendly: '1', washable: '1', care_instructions: 'Hand wash', exact_width_cm: '140', exact_length_cm: '220', weight_kg: '1' } },
  { sku: 'CUR-TST-03', name: 'Velvet Drape Curtain 3', desc: 'Luxury heavy velvet drapes.', regular_price: '399', sale_price: '299', stock: 15, weight: '6', length: '280', width: '150', height: '3', cats: ['Curtains', 'Velvet'], images: ['https://picsum.photos/id/116/800/800.jpg', 'https://picsum.photos/id/117/800/800.jpg'], meta: { design_id: 'CUR-DES-003', item_number: 'HOD-CUR-003', construction: 'Woven', country_of_origin: 'Turkey', pet_friendly: '1', washable: '0', care_instructions: 'Dry clean', exact_width_cm: '150', exact_length_cm: '280', weight_kg: '6' } },
  { sku: 'CUR-TST-04', name: 'Patterned Blackout 4', desc: 'Modern patterned blackout panels.', regular_price: '279', sale_price: '229', stock: 0, weight: '4', length: '250', width: '140', height: '2', cats: ['Curtains', 'Blackout'], images: ['https://picsum.photos/id/118/800/800.jpg', 'https://picsum.photos/id/119/800/800.jpg'], meta: { design_id: 'CUR-DES-004', item_number: 'HOD-CUR-004', construction: 'Printed', country_of_origin: 'China', pet_friendly: '1', washable: '1', care_instructions: 'Machine wash', exact_width_cm: '140', exact_length_cm: '250', weight_kg: '4' } },
  { sku: 'CUR-TST-05', name: 'Sheer Silk Curtain 5', desc: 'Premium silk sheer panels.', regular_price: '499', sale_price: '', stock: 10, weight: '1', length: '280', width: '140', height: '1', cats: ['Curtains', 'Sheer'], images: ['https://picsum.photos/id/120/800/800.jpg', 'https://picsum.photos/id/121/800/800.jpg'], meta: { design_id: 'CUR-DES-005', item_number: 'HOD-CUR-005', construction: 'Woven', country_of_origin: 'India', pet_friendly: '0', washable: '0', care_instructions: 'Dry clean only', exact_width_cm: '140', exact_length_cm: '280', weight_kg: '1' } },
];

async function getOrCreateCategory(catName) {
  // First search for the category
  const searchRes = await fetch(`${WC_BASE_URL}/wp-json/wc/v3/products/categories?search=${encodeURIComponent(catName)}`, { headers: authHeader });
  const searchData = await searchRes.json();
  
  const existing = searchData.find(c => c.name === catName);
  if (existing) return existing.id;
  
  // If not found, create it
  const createRes = await fetch(`${WC_BASE_URL}/wp-json/wc/v3/products/categories`, {
    method: 'POST',
    headers: { ...authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: catName })
  });
  
  const createData = await createRes.json();
  return createData.id;
}

async function uploadProducts() {
  console.log('Starting product upload...');
  
  for (const prod of productsData) {
    console.log(`\nProcessing ${prod.sku} - ${prod.name}`);
    
    // 1. Resolve Categories
    const categoryIds = [];
    for (const catName of prod.cats) {
      const id = await getOrCreateCategory(catName);
      if (id) categoryIds.push({ id });
    }
    
    // 2. Prepare Metadata
    const meta_data = Object.entries(prod.meta).map(([key, value]) => ({
      key: key, 
      value: value
    }));

    // 3. Prepare Images
    const wcImages = prod.images.map(url => ({ src: url }));
    
    // 4. Create Product
    const productPayload = {
      name: prod.name,
      type: 'simple',
      sku: prod.sku,
      description: prod.desc,
      regular_price: prod.regular_price,
      sale_price: prod.sale_price || '',
      manage_stock: true,
      stock_quantity: prod.stock,
      weight: prod.weight,
      dimensions: {
        length: prod.length,
        width: prod.width,
        height: prod.height
      },
      categories: categoryIds,
      images: wcImages,
      meta_data: meta_data
    };
    
    console.log(`  Creating product in WooCommerce...`);
    const prodRes = await fetch(`${WC_BASE_URL}/wp-json/wc/v3/products`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(productPayload)
    });
    
    if (prodRes.ok) {
      const created = await prodRes.json();
      console.log(`  ✅ Successfully created ${prod.sku} (ID: ${created.id})`);
    } else {
      const err = await prodRes.text();
      console.error(`  ❌ Failed to create ${prod.sku}:`, err);
    }
  }
  
  console.log('\nUpload complete!');
}

uploadProducts();
