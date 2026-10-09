import bcrypt from "bcrypt";
import { User } from "../models/user/user.model.js";
import { Profile } from "../models/user/profile.model.js";
import { Restaurant } from "../models/restaurant/restaurant.model.js";
import { Menu } from "../models/menu/menu.model.js";

const DEMO_PASSWORD = "Demo@1234";

const DEMO_USERS = [
  {
    firstName: "Demo",
    lastName: "Customer",
    email: "demo.customer@foodapp.dev",
    isRestaurantOwner: false,
  },
  {
    firstName: "Demo",
    lastName: "Owner",
    email: "demo.owner@foodapp.dev",
    isRestaurantOwner: true,
  },
];

const DEMO_MENUS = [
  {
    name: "Paneer Butter Masala",
    description: "Creamy tomato gravy with soft paneer cubes",
    price: 249,
    imageUrl:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Veg Biryani",
    description: "Basmati rice cooked with vegetables and spices",
    price: 199,
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  },
];

const ensureDemoUser = async (details, hashedPassword) => {
  const existingUser = await User.findOne({ email: details.email });
  if (existingUser) {
    if (existingUser.isRestaurantOwner !== details.isRestaurantOwner) {
      existingUser.isRestaurantOwner = details.isRestaurantOwner;
      await existingUser.save();
    }
    return existingUser;
  }

  const profile = await Profile.create({});
  return User.create({
    firstName: details.firstName,
    lastName: details.lastName,
    email: details.email,
    password: hashedPassword,
    additionalDetails: profile._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${details.firstName} ${details.lastName}`,
    isDemo: true,
    isRestaurantOwner: details.isRestaurantOwner,
  });
};

const ensureOwnerRestaurant = async (owner) => {
  const existingRestaurant = await Restaurant.findOne({ user: owner._id });
  if (existingRestaurant) {
    return existingRestaurant;
  }

  const menus = await Menu.create(DEMO_MENUS);
  return Restaurant.create({
    user: owner._id,
    restaurantName: "Spice House",
    city: "Delhi",
    country: "India",
    deliveryTime: 30,
    cuisines: ["Indian", "Chinese"],
    menus: menus.map((menu) => menu._id),
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  });
};

const seedDemo = async () => {
  try {
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    const [customer, owner] = await Promise.all(
      DEMO_USERS.map((details) => ensureDemoUser(details, hashedPassword))
    );
    await ensureOwnerRestaurant(owner);
    console.log("Demo accounts ready");
    return { customer, owner };
  } catch (error) {
    console.error("Demo seed failed:", error.message);
  }
};

export default seedDemo;
