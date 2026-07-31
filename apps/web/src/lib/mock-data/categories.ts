import type { Category } from "#lib/types"

export const categories: Category[] = [
  {
    id: "cat-electronics",
    slug: "electronics",
    name: "Electronics",
    description: "Audio, wearables, and everyday tech essentials.",
    image_url: "https://picsum.photos/seed/cat-electronics/640/480",
    product_count: 5,
  },
  {
    id: "cat-apparel",
    slug: "apparel",
    name: "Apparel",
    description: "Wardrobe staples built for daily wear.",
    image_url: "https://picsum.photos/seed/cat-apparel/640/480",
    product_count: 4,
  },
  {
    id: "cat-footwear",
    slug: "footwear",
    name: "Footwear",
    description: "Runners, sneakers, and boots for every terrain.",
    image_url: "https://picsum.photos/seed/cat-footwear/640/480",
    product_count: 3,
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Carry goods and finishing touches.",
    image_url: "https://picsum.photos/seed/cat-accessories/640/480",
    product_count: 3,
  },
  {
    id: "cat-home-living",
    slug: "home-living",
    name: "Home & Living",
    description: "Comfort objects for a calmer home.",
    image_url: "https://picsum.photos/seed/cat-home-living/640/480",
    product_count: 3,
  },
  {
    id: "cat-fitness",
    slug: "fitness",
    name: "Fitness",
    description: "Training gear dropping soon.",
    image_url: "https://picsum.photos/seed/cat-fitness/640/480",
    product_count: 0,
  },
]
