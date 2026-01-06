import { Product } from '../types/product';

/* ---------------- IMAGES ---------------- */
import BonelessChicken from '../assets/optmzd/BonelessChicken.webp';
import Putharekulu from '../assets/optmzd/putharekulu.webp';
import Ginger from '../assets/optmzd/Ginger.webp';
import GonguraChickenPickle from '../assets/optmzd/GonguraChickenPickle.webp';
import GonguraPrawns from '../assets/optmzd/GonguraPrawns.webp';
import GummadiVadiyalu from '../assets/optmzd/GummadiVadiyalu.webp';
import Kaakarakaaya from '../assets/optmzd/Kaakarakaaya.webp';
import Karveypaaku from '../assets/optmzd/Karveypaaku.webp';
import Korameenu from '../assets/optmzd/Korameenu.webp';
import Kothimeera from '../assets/optmzd/Kothimeera.webp';
import Lemon from '../assets/optmzd/Lemon.webp';
import Maagaya from '../assets/optmzd/maagaya.webp';
import Mango from '../assets/optmzd/Mango.webp';
import Chicken from '../assets/optmzd/Chicken.webp';
import Gongura from '../assets/optmzd/Gongura.webp';
import Mutton from '../assets/optmzd/Mutton.webp';
import PanduMirchi from '../assets/optmzd/PanduMirchi.webp';
import PindiVadiyalu from '../assets/optmzd/PindiVadiyalu.webp';
import Prawns from '../assets/optmzd/Prawns.webp';
import RedChilliPowder from '../assets/optmzd/RedChilliPowder.webp';
import Tomato from '../assets/optmzd/Tomato.webp';
import TurmericPowder from '../assets/optmzd/TurmericPowder.webp';
import Usirikaaya from '../assets/optmzd/Usirikaaya.webp';

/* ---------------- PRODUCTS ---------------- */
const products: Product[] = [
  { id: 'mango', name: 'Mango Pickle', teluguName: 'ఆవకాయ పచ్చడి', price: 249, weight: '300gms', image:Mango, category: 'veg', rating: 4.6, ratingCount: 1280, popularity: 920, orders: 3400, trendingScore: 78 },
  { id: 'gongura', name: 'Gongura Pickle', teluguName: 'గోంగూర పచ్చడి', price: 249, weight: '300gms', image: Gongura, category: 'veg', rating: 4.5, ratingCount: 980, popularity: 860, orders: 2900, trendingScore: 72 },
  { id: 'maagaya', name: 'Maagaya Pickle', teluguName: 'మాగాయ పచ్చడి', price: 269, weight: '300gms', image: Maagaya, category: 'veg', rating: 4.4, ratingCount: 640, popularity: 600, orders: 1100, trendingScore: 48 },
  { id: 'tomato', name: 'Tomato Pickle', teluguName: 'టమాటా పచ్చడి', price: 199, weight: '300gms', image: Tomato, category: 'veg', rating: 4.3, ratingCount: 520, popularity: 430, orders: 980, trendingScore: 36 },
  { id: 'lemon', name: 'Lemon Pickle', teluguName: 'నిమ్మకాయ పచ్చడి', price: 199, weight: '300gms', image: Lemon, category: 'veg', rating: 4.4, ratingCount: 610, popularity: 540, orders: 1250, trendingScore: 44 },
  { id: 'usirikaaya', name: 'Usirikaaya Pickle', teluguName: 'ఉసిరికాయ పచ్చడి', price: 219, weight: '300gms', image: Usirikaaya, category: 'veg', rating: 4.5, ratingCount: 430, popularity: 380, orders: 820, trendingScore: 30 },
  { id: 'ginger', name: 'Ginger Pickle', teluguName: 'అల్లం పచ్చడి', price: 229, weight: '300gms', image: Ginger, category: 'veg', rating: 4.3, ratingCount: 390, popularity: 310, orders: 720, trendingScore: 26 },
  { id: 'kothimeera', name: 'Kothimeera Pickle', teluguName: 'కొత్తిమీర పచ్చడి', price: 219, weight: '300gms', image: Kothimeera, category: 'veg', rating: 4.2, ratingCount: 360, popularity: 290, orders: 610, trendingScore: 18 },
  { id: 'karveypaaku', name: 'Karveypaaku Pickle', teluguName: 'కరివేపాకు పచ్చడి', price: 219, weight: '300gms', image: Karveypaaku, category: 'veg', rating: 4.4, ratingCount: 410, popularity: 350, orders: 770, trendingScore: 34 },
  { id: 'kaakarakaaya', name: 'Kaakarakaaya Pickle', teluguName: 'కాకరకాయ పచ్చడి', price: 219, weight: '300gms', image: Kaakarakaaya, category: 'veg', rating: 4.1, ratingCount: 290, popularity: 240, orders: 520, trendingScore: 14 },
  { id: 'panduMirchi', name: 'Pandu Mirchi Pickle', teluguName: 'పండు మిర్చి పచ్చడి', price: 229, weight: '300gms', image: PanduMirchi, category: 'veg', rating: 4.6, ratingCount: 470, popularity: 450, orders: 980, trendingScore: 50 },

  { id: 'chicken', name: 'Chicken Pickle', teluguName: 'కోడి మాంసం పచ్చడి', price: 599, weight: '300gms', image: Chicken, category: 'non-veg', rating: 4.7, ratingCount: 1120, popularity: 1100, orders: 4200, trendingScore: 88 },
  { id: 'boneless', name: 'Boneless Chicken Pickle', teluguName: 'ఎముకలేని కోడి పచ్చడి', price: 629, weight: '300gms', image: BonelessChicken, category: 'non-veg', rating: 4.8, ratingCount: 860, popularity: 840, orders: 3100, trendingScore: 82 },
  { id: 'gonguraChicken', name: 'Gongura Chicken Pickle', teluguName: 'గోంగూర కోడి పచ్చడి', price: 649, weight: '300gms', image: GonguraChickenPickle, category: 'non-veg', rating: 4.6, ratingCount: 720, popularity: 660, orders: 2100, trendingScore: 66 },
  { id: 'prawns', name: 'Prawns Pickle', teluguName: 'రొయ్యల పచ్చడి', price: 649, weight: '300gms', image: Prawns, category: 'non-veg', rating: 4.5, ratingCount: 540, popularity: 520, orders: 1500, trendingScore: 56 },
  { id: 'gonguraPrawns', name: 'Gongura Prawns Pickle', teluguName: 'గోంగూర రొయ్యల పచ్చడి', price: 669, weight: '300gms', image: GonguraPrawns, category: 'non-veg', rating: 4.6, ratingCount: 510, popularity: 470, orders: 1320, trendingScore: 52 },
  { id: 'mutton', name: 'Mutton Pickle', teluguName: 'మటన్ పచ్చడి', price: 699, weight: '300gms', image: Mutton, category: 'non-veg', rating: 4.7, ratingCount: 610, popularity: 580, orders: 1750, trendingScore: 60 },
  { id: 'korameenu', name: 'Korameenu Fish Pickle', teluguName: 'కొరమీను చేప పచ్చడి', price: 679, weight: '300gms', image: Korameenu, category: 'non-veg', rating: 4.6, ratingCount: 430, popularity: 390, orders: 920, trendingScore: 42 },

  { id: 'redchilli', name: 'Red Chilli Powder', teluguName: 'కారం పొడి', price: 199, weight: '250gms', image: RedChilliPowder, category: 'powder', rating: 4.4, ratingCount: 890, popularity: 720, orders: 2100, trendingScore: 46 },
  { id: 'turmeric', name: 'Turmeric Powder', teluguName: 'పసుపు పొడి', price: 149, weight: '250gms', image: TurmericPowder, category: 'powder', rating: 4.5, ratingCount: 760, popularity: 640, orders: 1800, trendingScore: 40 },

  { id: 'gummadi', name: 'Gummadi Vadiyalu', teluguName: 'గుమ్మడి వడియాలు', price: 179, weight: '200gms', image: GummadiVadiyalu, category: 'snack', rating: 4.3, ratingCount: 410, popularity: 360, orders: 880, trendingScore: 28 },
  { id: 'pindi', name: 'Pindi Vadiyalu', teluguName: 'పిండి వడియాలు', price: 169, weight: '200gms', image: PindiVadiyalu, category: 'snack', rating: 4.2, ratingCount: 380, popularity: 320, orders: 720, trendingScore: 20 },

  { id: 'putharekulu', name: 'Putharekulu', teluguName: 'పూతరేకులు', price: 299, weight: '250gms', image: Putharekulu, category: 'sweet', rating: 4.8, ratingCount: 1320, popularity: 1200, orders: 4100, trendingScore: 92 },
];

export default products;