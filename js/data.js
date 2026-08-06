/* 1. MOCK DATA SẢN PHẨM & BIẾN THỂ */
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Oversized Wool Blazer",
    category: "Outerwear",
    desc: "Áo Blazer chất liệu dạ len cao cấp, phom dáng rộng chuẩn phong cách Minimalism Gen Z.",
    priceVND: 2450000,
    priceUSD: 98,
    colors: ["Đen", "Kem"],
    sizes: ["S", "M", "L"],
    variants: [
      { sku: "BLZ-BLK-S", color: "Đen", size: "S", stock: 5 },
      { sku: "BLZ-BLK-M", color: "Đen", size: "M", stock: 8 },
      { sku: "BLZ-BLK-L", color: "Đen", size: "L", stock: 2 },
      { sku: "BLZ-CRE-S", color: "Kem", size: "S", stock: 4 },
      { sku: "BLZ-CRE-M", color: "Kem", size: "M", stock: 6 },
      { sku: "BLZ-CRE-L", color: "Kem", size: "L", stock: 0 }
    ],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Pleated Wide-Leg Trousers",
    category: "Pants",
    desc: "Quần tây ống rộng xếp ly tinh tế, tạo ứng dụng thanh lịch dài đôi chân.",
    priceVND: 1250000,
    priceUSD: 50,
    colors: ["Xám", "Đen"],
    sizes: ["S", "M", "L"],
    variants: [
      { sku: "TRS-GRY-S", color: "Xám", size: "S", stock: 10 },
      { sku: "TRS-GRY-M", color: "Xám", size: "M", stock: 12 },
      { sku: "TRS-GRY-L", color: "Xám", size: "L", stock: 5 },
      { sku: "TRS-BLK-S", color: "Đen", size: "S", stock: 7 },
      { sku: "TRS-BLK-M", color: "Đen", size: "M", stock: 9 },
      { sku: "TRS-BLK-L", color: "Đen", size: "L", stock: 3 }
    ],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Minimalist Silk Shirt",
    category: "Tops",
    desc: "Áo sơ mi lụa tơ tằm mềm mại, bề mặt bắt sáng nhẹ nhàng sang trọng.",
    priceVND: 1650000,
    priceUSD: 66,
    colors: ["Trắng", "Xanh Olive"],
    sizes: ["S", "M"],
    variants: [
      { sku: "SHT-WHT-S", color: "Trắng", size: "S", stock: 6 },
      { sku: "SHT-WHT-M", color: "Trắng", size: "M", stock: 4 },
      { sku: "SHT-OLV-S", color: "Xanh Olive", size: "S", stock: 3 },
      { sku: "SHT-OLV-M", color: "Xanh Olive", size: "M", stock: 0 }
    ],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Structured Leather Tote",
    category: "Accessories",
    desc: "Túi Tote da thật đứng phom, đường may thủ công tỉ mỉ dành cho giới mộ điệu.",
    priceVND: 3200000,
    priceUSD: 128,
    colors: ["Đen", "Nâu Tan"],
    sizes: ["One-Size"],
    variants: [
      { sku: "BAG-BLK-OS", color: "Đen", size: "One-Size", stock: 5 },
      { sku: "BAG-TAN-OS", color: "Nâu Tan", size: "One-Size", stock: 3 }
    ],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Cropped Raw Denim Jacket",
    category: "Outerwear",
    desc: "Áo khoác Denim dáng ngắn phá cách, chất liệu Jeans thô đứng dáng Gen Z.",
    priceVND: 1850000,
    priceUSD: 74,
    colors: ["Xanh Indigo", "Đen Khói"],
    sizes: ["S", "M", "L"],
    variants: [
      { sku: "JCK-IND-S", color: "Xanh Indigo", size: "S", stock: 8 },
      { sku: "JCK-IND-M", color: "Xanh Indigo", size: "M", stock: 6 },
      { sku: "JCK-BLK-S", color: "Đen Khói", size: "S", stock: 4 }
    ],
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Minimalist Slip Satin Dress",
    category: "Dresses",
    desc: "Đầm lụa Satin hai dây quyến rũ, cắt may bias-cut ôm trọn đường cong.",
    priceVND: 2100000,
    priceUSD: 84,
    colors: ["Đen Huyền", "Champagne"],
    sizes: ["S", "M"],
    variants: [
      { sku: "DRS-BLK-S", color: "Đen Huyền", size: "S", stock: 3 },
      { sku: "DRS-CMP-M", color: "Champagne", size: "M", stock: 5 }
    ],
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Chunky Leather Loafers",
    category: "Footwear",
    desc: "Giày Loafer đế xuồng phong cách Y2K/Modern Gen Z, chất da bóng Ý.",
    priceVND: 2900000,
    priceUSD: 116,
    colors: ["Đen Bóng"],
    sizes: ["38", "39", "40", "41"],
    variants: [
      { sku: "SH-BLK-38", color: "Đen Bóng", size: "38", stock: 2 },
      { sku: "SH-BLK-39", color: "Đen Bóng", size: "39", stock: 5 },
      { sku: "SH-BLK-40", color: "Đen Bóng", size: "40", stock: 4 }
    ],
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    name: "Cashmere Knit Turtleneck",
    category: "Tops",
    desc: "Áo len cổ lọ dệt Cashmere mềm mại tuyệt đối cho mùa đông.",
    priceVND: 1950000,
    priceUSD: 78,
    colors: ["Kem Beige", "Xám Chuột"],
    sizes: ["S", "M", "L"],
    variants: [
      { sku: "KNT-BEI-S", color: "Kem Beige", size: "S", stock: 7 },
      { sku: "KNT-GRY-M", color: "Xám Chuột", size: "M", stock: 9 }
    ],
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80"
  }
];

/* 2. MOCK VOUCHERS */
const VOUCHERS = { 
  "GENZ10": 0.10, 
  "LUXURY50": 50000 
};

/* 3. TỪ ĐIỂN I18N */
const I18N = {
  VI: { adminNav: "Admin Portal", heroSub: "Thiết kế tối giản, chất liệu cao cấp và chuẩn phom dáng hiện đại.", catalogTitle: "Bộ Sưu Tập Mới", cartTitle: "Giỏ Hàng Của Bạn", colorLabel: "Màu sắc:", sizeLabel: "Kích thước (Size):", stockLabel: "Tồn kho khả dụng:", cityLabel: "Chọn Tỉnh/Thành nhận hàng (API Ship GHN Mock):" },
  EN: { adminNav: "Admin Dashboard", heroSub: "Minimalist design, premium fabrics & modern tailoring for Gen Z.", catalogTitle: "New Collection", cartTitle: "Your Shopping Bag", colorLabel: "Color:", sizeLabel: "Size:", stockLabel: "Available Stock:", cityLabel: "Select Shipping Destination (GHN API Mock):" }
};
