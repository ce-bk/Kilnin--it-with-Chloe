import mixingGlazes1 from "@/assets/piece-mixing-glazes-1.jpg";
import mixingGlazes2 from "@/assets/piece-mixing-glazes-2.jpg";
import mixingGlazes3 from "@/assets/piece-mixing-glazes-3.jpg";
import coneLamp3 from "@/assets/cone-lamp-2.jpg";
import coneLampHero from "@/assets/cone-lamp-hero.jpg";
import coneLampSketch from "@/assets/cone-lamp-sketch.jpg";
import unusualJugs1 from "@/assets/piece-unusual-jugs-1.png";
import candleHolder1 from "@/assets/piece-candle-holder-1.png";
import candleHolder2 from "@/assets/piece-candle-holder-2.png";
import fondueSet from "@/assets/piece-fondue-party-set.png";
import fondueCheese from "@/assets/piece-fondue-party-cheese.jpg";
import elevatedHero from "@/assets/piece-elevated-delights-stands-trio.jpg";
import elevatedTrio from "@/assets/piece-elevated-delights-IMG_4327.jpg";
import elevatedPastries from "@/assets/piece-elevated-delights-IMG_4311.jpg";
import elevatedWheel from "@/assets/piece-elevated-delights-IMG_1695.jpg";
import fantasyLampLit from "@/assets/piece-fantasy-lamp-lit.jpg";
import fantasyLampFull from "@/assets/piece-fantasy-lamp-IMG_3931.jpg";
import fantasyLampTexture from "@/assets/piece-fantasy-lamp-IMG_3934.jpg";
import fantasyLampCable from "@/assets/piece-fantasy-lamp-IMG_3927.jpg";
import afternoonCoffeeMug from "@/assets/piece-afternoon-coffee-IMG_4334.jpg";
import afternoonCoffeeTable from "@/assets/piece-afternoon-coffee-IMG_4338.jpg";
import afternoonCoffeeLineup from "@/assets/piece-afternoon-coffee-IMG_4332.jpg";
import geometricTrio from "@/assets/piece-geometric-trio.jpg";
import geometricRed from "@/assets/piece-geometric-IMG_0893.jpg";
import geometricNatural from "@/assets/piece-geometric-natural-red.jpg";

export type Purpose = "Functional" | "Decorative" | "Sculptural" | "Lighting";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Technique = "Hand-built" | "Wheel-thrown" | "Slab-building";

export interface Piece {
  id: string;
  name: string;
  techniques: Technique[];
  purpose: Purpose;
  purposes?: Purpose[];
  estimatedTime: string;
  images: string[];
  processImages?: string[];
  story: string[];
  materials: string[];
  steps: { title: string; description: string; note?: string }[];
}

export const pieces: Piece[] = [
  {
    id: "mixing-glazes",
    name: "Mixing Glazes",
    techniques: ["Wheel-thrown", "Hand-built", "Slab-building"],
    purpose: "Functional",
    estimatedTime: "4–6 hours",
    images: [mixingGlazes1, mixingGlazes2, mixingGlazes3],
    story: [
      "Cooking and clay have a lot in common. Both are about experimenting with raw ingredients and seeing how they change when things get hot. This little set came from that curiosity. Each piece has its own shape and movement, which is exactly how I wanted it: imperfect, organic and full of life.",
      "The real fun was the glazing. Instead of keeping things uniform, I layered a glossy transparent glaze over a soft matte colour to see how they'd interact. Where they overlap, they made an unexpected third colour and a completely new texture. I also pressed a subtle pattern into the plate, and the glaze transformed the surface. It feels like a little surprise every time the light hits it.",
      "I've completely fallen in love with this set. It lives next to the hob in my kitchen, where I use it to mix spices, and the little cup holds the tools I use to crush and blend them."
    ],
    materials: [
      "2 kg stoneware clay (mid-fire, cone 6)",
      "Amber celadon glaze (commercially mixed or studio recipe)",
      "Transparent glaze",
      "Wax resist",
      "Pottery wheel and trimming tools",
      "Pattern roller",
      "Kiln stilts",
      "Soft sponge"
    ],
    steps: [
      { title: "Throw the bowl", description: "Wedge 400 g of stoneware clay to remove air bubbles. Centre it on the wheel and open it into a wide, shallow bowl with walls about 6 mm thick. Pull the walls up in 2–3 steady lifts and smooth the curve with a sponge.", note: "Keep your hands wet but not dripping. The clay should move with you, not fight you." },
      { title: "Throw the cup", description: "Wedge 600 g of stoneware clay and centre it. Open the form and pull the walls up taller and straighter than the bowl, keeping them an even 6 mm. Refine the rim with a damp sponge." },
      { title: "Throw the small bowl", description: "Wedge 200 g of stoneware clay and centre it. Open it into a small, deeper bowl to act as the set's little cup. Once leather-hard, trim a neat foot ring." },
      { title: "Build the plate from a slab", description: "Roll 800 g of stoneware clay into a slab about 6 mm thick. Cut a rectangle, then lift the edges gently to give the rim a soft wave. Run the pattern roller across the centre to press in a subtle texture." },
      { title: "Dry and bisque fire", description: "Let all four pieces dry slowly over 3–5 days until bone dry. Bisque fire to cone 06 (about 1000 °C). Once cool, paint wax resist on the foot rings and bases." },
      { title: "Layer the glazes", description: "Apply the amber celadon as a soft matte base coat on each piece. Once dry, layer the transparent glaze on top, overlapping in places. Where they meet, you'll get an unexpected third colour and a new texture.", note: "Glaze thickness matters a lot. Too thin and the colours wash out; too thick and they run. Aim for the consistency of single cream." },
      { title: "Glaze fire", description: "Load the pieces onto kiln stilts. Fire to cone 6 (about 1220 °C) with a slow ramp over the final 100 °C. Let the kiln cool naturally, and don't peek for at least 12 hours.", note: "Be patient here. Rapid cooling can cause crazing in the glaze." }
    ]
  },
  {
    id: "cone-lamp",
    name: "Cone Lamp",
    techniques: ["Wheel-thrown"],
    purpose: "Lighting",
    purposes: ["Functional", "Lighting"],
    estimatedTime: "8–10 hours",
    images: [coneLampHero, coneLampSketch, coneLamp3],
    story: [
      "This lamp was inspired by a moment I look forward to every day on my balcony. As the sun sets, the sky turns a deep evening blue and meets the warm brick of the buildings below. I wanted to capture that shift in light and colour, so I gave the lamp a rich blue top cone that meets a warm, earthy brown base. To me, it's the soft glow that settles over the city at the end of the day.",
      "At home, I use a smart bulb that switches on as the sun goes down. Watching the lamp light up while the real sky is changing makes it more than a light. It's a reminder to slow down and bring a bit of that sunset indoors.",
    ],
    materials: [
      "2 kg toffee clay",
      "Pottery wheel and fine trimming tools",
      "Lamp fitting kit (E27 bulb holder, cable, inline switch)",
      "Deep blue glaze (for the top cone)",
      "Warm earthy brown glaze (for the base)",
      "Fine-grit sandpaper (400, 800, 1200)",
      "Kiln posts for support during firing"
    ],
    steps: [
      { title: "Prepare the clay", description: "Wedge the toffee clay thoroughly to remove air pockets. It should feel smooth and even all the way through." },
      { title: "Throw the cone form", description: "Centre about 800 g of the clay and pull it up into a tall, narrow cone. The walls should taper from about 5 mm at the base to 2–3 mm at the top. Work slowly and steadily.", note: "If the form starts to wobble, slow the wheel down. The clay responds to patience." },
      { title: "Create the base", description: "With the remaining 1.2 kg, throw a separate shallow dish for the base. Make it wide enough to be stable (about 12 cm across) with a central channel for the cord." },
      { title: "Trim and cut the cord holes", description: "When leather-hard, trim both pieces and even out the walls. While the clay is still soft enough to cut cleanly, carve the cord holes in the cone and the base so the cable and bulb holder can pass through. That way there's no drilling after firing." },
      { title: "Bisque fire", description: "Dry the clay very slowly over 5–7 days to prevent cracking. Support the cone with kiln posts and bisque fire to cone 06." },
      { title: "Apply the two glazes and final fire", description: "Glaze the cone deep blue and the base warm brown, keeping a clean line where they meet. Fire to cone 10 (about 1300 °C)." },
      { title: "Sand and assemble", description: "Sand the bottom of both pieces with progressively finer grits until smooth. Thread the cable through the holes and fit the E27 bulb holder." }
    ]
  },
  {
    id: "unusual-jugs",
    name: "Unusual Jugs",
    techniques: ["Wheel-thrown", "Hand-built"],
    purposes: ["Functional", "Decorative"],
    purpose: "Functional",
    estimatedTime: "3–5 hours",
    images: [unusualJugs1],
    story: [
      "These jugs began as a rebellion against uniformity. I'd spent a week throwing identical mugs for a commission, and my hands were craving something looser. I wanted each jug to have its own character, like siblings rather than clones.",
      "The handles were the most fun. Instead of pulling traditional handles, I tried coiled and flattened forms attached at unexpected angles. Some are more practical than others, and that's the point.",
      "There's something deeply human about imperfect everyday objects. When you pour milk from a jug that leans slightly left, you build a relationship with it. These jugs are an invitation to embrace the wonky."
    ],
    materials: [
      "1 kg stoneware clay per jug (cone 6)",
      "Pottery wheel",
      "Wooden rib and metal kidney tools",
      "Pulled handle clay (additional 200g per jug)",
      "Selection of earth-tone glazes (celadon, ash, shino)",
      "Scoring tool"
    ],
    steps: [
      { title: "Throw the jug bodies", description: "Throw three jug forms and deliberately vary the proportions: one tall and narrow, one round and squat, one in between. Aim for walls around 5–6 mm thick. They aren't meant to match." },
      { title: "Form the spouts", description: "While the clay is still soft, use your thumb and forefinger to coax a pouring lip on each jug. Give each spout its own character: one generous, one precise, one playful." },
      { title: "Pull and attach handles", description: "Pull handles from a thick coil, wetting your hands and smoothing as you go. Score the attachment points and press each handle firmly into place, supporting the jug from inside. A little watered-down clay helps it stick.", note: "Let the handles find their own curve as you pull. The clay will tell you what shape it wants to be." },
      { title: "Dry and bisque fire", description: "Dry slowly under plastic for 2 days, then uncovered for another 2–3 days. Bisque fire." },
      { title: "Glaze with earth tones", description: "Pick a different glaze for each jug to bring out its personality. Dipping, pouring and brushing each give a different finish. Glaze fire." }
    ]
  },
  {
    id: "candle-holder",
    name: "Candle Holder",
    techniques: ["Hand-built", "Slab-building"],
    purpose: "Decorative",
    purposes: ["Sculptural", "Decorative"],
    estimatedTime: "2–3 hours",
    images: [candleHolder1, candleHolder2],
    story: [
      "I wanted a piece that looks just as good in the afternoon as it does at night. By day, this candle holder is a quiet, rustic ornament in a soft neutral beige that sits happily on a shelf or table.",
      "In the evening, light the candle and it comes alive. The flame throws intricate patterns across the walls, a bit like light through stained glass. It's calming to watch, and the perfect companion for winding down at the end of the day."
    ],
    materials: [
      "800g toffee clay",
      "Rolling pin and slab roller (or wooden guides)",
      "Sharp craft knife or needle tool",
      "Tea light candle for sizing",
      "Shiny white glaze",
      "Sponge and water"
    ],
    steps: [
      { title: "Roll and cut the slab", description: "Roll the clay into an even slab about 5 mm thick, using wooden guides on either side. Cut a rectangle about 25 × 12 cm. This will wrap into your cylinder." },
      { title: "Mark and cut the lattice", description: "Using a ruler, lightly score a diagonal grid across the slab at 45°, with lines about 2 cm apart. Cut out alternating diamonds with a sharp knife. Leave about 2 cm of solid clay at the top and bottom for strength.", note: "Work on a slightly firm slab. Too soft and the cuts distort; too hard and the clay cracks." },
      { title: "Form the cylinder", description: "Score and slip the short edges. Bend the slab into a cylinder and press the join firmly together. Smooth the seam inside and out." },
      { title: "Add the base", description: "Roll a small circle of clay slightly larger than the cylinder. Score and slip both surfaces, attach the base, then trim flush and smooth the join." },
      { title: "Fire and glaze", description: "Once bone dry, bisque fire to cone 06. Apply the shiny white glaze to seal the surface and make it heat-safe, then glaze fire to cone 6. Pop a tea light inside and enjoy the shadows.", note: "Always use the candle holder on a heat-safe surface and never leave a burning candle unattended." }
    ]
  },
  {
    id: "fondue-party",
    name: "Fondue Party",
    techniques: ["Wheel-thrown"],
    purpose: "Functional",
    estimatedTime: "5–7 hours",
    images: [fondueSet, fondueCheese],
    story: [
      "This set came from my love of hosting. Sharing food from dishes you've made yourself turns a simple evening into an occasion. I wanted a fondue set that felt warm, welcoming and a little playful, the kind you pull out whenever friends come over.",
      "The clay is called Puntitos, and it's one of my favourites. It has little dark flecks all the way through, almost like freckles. Because the clay does so much of the visual work, I kept the finish simple with a soft white matte glaze that lets the speckles show.",
      "I made the whole set on the wheel: a sturdy base with a cut-out for a tea light, a bowl that sits on top for cheese or chocolate, and a few side bowls for bread, fruit and anything else you fancy dipping. For a small table like mine, I also threw a set of cake stands that lift the sides up so nothing feels crowded. You'll find those in the matching collection."
    ],
    materials: [
      "Around 2 kg Puntitos speckled clay (plus extra for the side bowls)",
      "Pottery wheel and trimming tools",
      "Wire cutter and needle tool",
      "Sharp knife or fettling tool for cutting the candle opening",
      "White matte glaze",
      "Tea light candle for sizing the base opening",
      "Sponge and water"
    ],
    steps: [
      { title: "Throw the base", description: "Wedge about 600 g of Puntitos clay and centre it. Throw a sturdy, slightly tapered cylinder, open at the top, with walls around 7–8 mm thick so it stays stable under the bowl. Keep the rim flat and even for the bowl to rest on.", note: "A heavier base feels more grounded and gives you room to cut the candle opening later without weakening the form." },
      { title: "Throw the top bowl", description: "Wedge around 800 g of clay and centre it. Open a generous bowl with a small step under the rim so it sits securely on the base. Check the fit while both pieces are still soft and adjust until it nests without wobbling." },
      { title: "Throw the side bowls", description: "Using 150–200 g of clay each, throw a few smaller bowls for bread and dippers. Vary the size and depth a little so the set feels handmade rather than uniform." },
      { title: "Cut the candle opening", description: "Once the base is leather-hard, cut an arched opening near the bottom with a sharp knife. Make it big enough to slide a tea light in and out easily, and to let air in so the flame stays lit. Smooth the edges with a damp sponge." },
      { title: "Trim and refine", description: "When everything is leather-hard, trim foot rings on the bowls and tidy the base. Stack the set again and adjust any rims that don't sit quite right." },
      { title: "Dry and bisque fire", description: "Dry the set slowly and evenly over several days until bone dry. Bisque fire to cone 06, and the speckles will start to show through." },
      { title: "Glaze and final fire", description: "Apply the white matte glaze in an even coat, letting the flecks in the clay peek through. Wax the foot rings and the underside of the top bowl's lip so it doesn't fuse to the base. Glaze fire to the temperature recommended for your clay and glaze.", note: "Pair the set with the matching cake stands for extra serving height when your table is short on space." }
    ]
  },
  {
    id: "elevated-delights",
    name: "Elevated Delights",
    techniques: ["Wheel-thrown"],
    purpose: "Functional",
    estimatedTime: "4–6 hours",
    images: [elevatedTrio, elevatedPastries, elevatedHero],
    processImages: [elevatedWheel],
    story: [
      "These cake stands are all about hosting. After an afternoon laying out a spread for a dinner party, there's never quite enough room on the table. The stands give each dish its own little stage and free up space underneath for more.",
      "They've also become part of a ritual I picked up after moving to Spain: La Merienda. It's an afternoon pause for a coffee, tea or mate with something sweet, a bit like British afternoon tea. In the photos are two of my favourite treats: pastéis de nata (I recently brought some back from Belém, and they really are as good as everyone says) and medialunas from Alfa, one of our go-tos here in Barcelona.",
      "There are three stands, made two different ways. One is thrown in a single piece, with the plate and stem pulled from the same lump of clay. The other two are made in parts: plates and hollow cylinders thrown separately, then scored, slipped and joined at leather-hard."
    ],
    materials: [
      "Around 1.5 kg speckled stoneware clay (enough for all three stands)",
      "Pottery wheel and trimming tools",
      "Wire cutter and needle tool",
      "Scoring tool and slip for joining",
      "Soft white speckled glaze (matte or satin)",
      "Sponge and water"
    ],
    steps: [
      { title: "Method 1: Throw the one-piece stand", description: "Wedge around 500 g of clay and centre it. Open it into a wide, shallow plate, then gather clay at the centre and pull it upward to form the stem. Keep the stem walls even and the plate level.", note: "A single piece takes more control, but the join between plate and stem is seamless, so there's no risk of it cracking later." },
      { title: "Method 2: Throw the plates", description: "For the other two stands, throw two shallow plates of around 400 g each. Aim for an even thickness and a slightly raised rim so food sits neatly. Let them firm up to soft leather-hard." },
      { title: "Method 2: Throw the hollow cylinders", description: "Throw two short hollow cylinders of around 200 g each for the stems. Leave them open at both ends and taper them slightly for a more elegant shape. Match the top diameter to where you want it to meet the plate." },
      { title: "Trim and refine", description: "Once everything is leather-hard, trim the foot of the one-piece stand and tidy the plates and cylinders. Check that each plate sits level and the cylinder rims are flat enough for a clean join." },
      { title: "Score, slip and join", description: "For the two-part stands, score the centre underside of each plate and the top rim of its cylinder. Apply slip generously, press them together, then smooth and reinforce the join with a damp finger or rib.", note: "Take your time lining up the stem before pressing. Once it's joined, it's hard to nudge back to centre." },
      { title: "Dry slowly and bisque fire", description: "Cover the stands loosely with plastic and dry them slowly over several days, especially around the joins, to prevent cracking. Once bone dry, bisque fire to cone 06." },
      { title: "Glaze and final fire", description: "Wax the foot rings, then brush or dip in a soft white speckled glaze, letting the flecks in the clay show through. Glaze fire to the temperature recommended for your clay and glaze." }
    ]
  },
  {
    id: "fantasy-lamp",
    name: "Fantasy Lamp",
    techniques: ["Wheel-thrown"],
    purpose: "Lighting",
    estimatedTime: "5–7 hours (plus drying and firing)",
    images: [fantasyLampLit, fantasyLampFull],
    processImages: [fantasyLampTexture, fantasyLampCable],
    story: [
      "This little lamp is one of my favourite pieces to look at. Its silhouette and texture make it feel like something that grew on the floor of a fantasy forest rather than something I made on a wheel. That was the whole idea: natural and mythical, somewhere between a mushroom, a pinecone and a tiny enchanted lantern.",
      "I threw it in two parts, a bulbous top and a sturdier bottom, then joined them while they were still soft. Once the form had settled, I carved little pebble-like marks all over the outside with a loop tool. That texture is what brings it to life, especially when light hits it from above and shadows pool in each scoop.",
      "It's also flexible. Drop a candle inside and it's a candle holder, or fit a lamp cable and it becomes a little table lamp. I'd recommend an E14 fitting because the opening is small, but an E27 will work too."
    ],
    materials: [
      "Around 1.2–1.5 kg stoneware clay",
      "Pottery wheel and trimming tools",
      "Loop tool or carving tool for the pebble texture",
      "Needle tool, scoring tool, and slip for joining",
      "Sponge and water",
      "Soft satin or clear glaze (optional; it looks lovely left raw too)",
      "E14 lamp cable with bulb fitting (E27 also works), or a tea light for candle use"
    ],
    steps: [
      { title: "Throw the bottom section", description: "Wedge around 600–700 g of clay and centre it. Throw a sturdy, slightly tapered cylinder that narrows at the top, leaving it open so you can join the second piece later. Keep the walls a generous 7–8 mm, since you'll be carving into them." },
      { title: "Throw the bulbous top", description: "Wedge a similar amount of clay and throw a rounded, almost onion-shaped form with a small opening at the top and a wider one at the bottom to match the lower section. Keep the walls consistent so both halves dry at the same rate." },
      { title: "Join the two pieces", description: "Once both parts are soft leather-hard, score and slip the matching rims, press them together and weld the seam with a rib and your fingers. Smooth the join from the outside so it disappears.", note: "Cover loosely with plastic for a few hours after joining so the moisture evens out. This stops the join cracking later." },
      { title: "Carve the texture", description: "Working from the top down, use a small loop tool to carve pebble-shaped marks over the whole outer surface. Follow the curves of the form so the texture feels organic, and vary the depth for more shadow when it's lit.", note: "Carve at firm leather-hard for clean, crisp scoops. Too wet and the marks smear; too dry and they chip." },
      { title: "Cut the cable opening", description: "On the bottom section, cut an arched opening big enough for a lamp cable or tea light. Smooth the edges with a damp sponge so they look clean and intentional." },
      { title: "Dry slowly and bisque fire", description: "Cover loosely with plastic and let the lamp dry slowly over several days, keeping an eye on the join. Once bone dry, bisque fire to cone 06." },
      { title: "Glaze (optional) and final fire", description: "Leave it raw for a soft, earthy finish, or brush a thin satin or clear glaze over the texture to bring out the highlights. Glaze fire to the temperature recommended for your clay." },
      { title: "Wire it up (or light a candle)", description: "Fit an E14 lamp cable and a low-wattage bulb through the bottom opening for a warm glow up through the top. An E27 works too. Prefer candlelight? Drop in a tea light and enjoy the shadows the texture throws across the walls.", note: "If you're wiring it as a lamp, use a low-heat LED bulb and have the electrics checked by someone qualified. Ceramic doesn't release heat the way a normal lampshade does." }
    ]
  },
  {
    id: "afternoon-coffee-for-one",
    name: "Afternoon Coffee for One",
    techniques: ["Wheel-thrown"],
    purpose: "Functional",
    estimatedTime: "4–5 hours (plus drying and firing)",
    images: [afternoonCoffeeTable, afternoonCoffeeLineup],
    processImages: [afternoonCoffeeMug],
    story: [
      "This set is built around one of my favourite moments of the day: afternoon coffee. I usually have a cortado (an espresso with a splash of oat milk), and I wanted pieces that make that small ritual feel more intentional. There's a mug for the coffee, a tiny jug for the milk, a bowl for sugar and another for an after-lunch chocolate or snack. Everything one person needs for a quiet pause.",
      "I made the whole set by throwing off the hump. It was only my second time trying it, and it's tricky: you keep one big lump of clay centred on the wheel and throw piece after piece off the top, wiring each one free before starting the next. Mine came out in slightly different sizes, which I love. Once they were lined up, I wondered what the set was actually for. The afternoon answered that, and it became a cortado set.",
      "I'm completely in love with the glaze. It's a warm, natural tone but incredibly shiny, almost metallic where the light catches it, especially around the top of the mug. When family visited recently, they brought specialty coffee from Costa Rica and dulce de leche treats from Mexico, and the set held them beautifully. Coffee is a big part of my day, and this set brings some extra joy to it."
    ],
    materials: [
      "Around 1.2 kg stoneware clay (one big hump for throwing off)",
      "Pottery wheel, wire cutter, and trimming tools",
      "Needle tool and small wooden rib",
      "Sponge and water",
      "Shiny natural-toned glaze (warm amber/caramel, satin or glossy)",
      "Wax resist for the foot rings"
    ],
    steps: [
      { title: "Centre the hump", description: "Wedge all the clay (around 1.2 kg) and centre it as one tall, stable mound. You'll only work off the top, so focus on getting the upper part perfectly centred.", note: "Throwing off the hump is about control, not strength. Keep your hands relaxed and only work the clay you need for each piece." },
      { title: "Throw the mug", description: "Open just the top of the hump (around 250 g) and pull the walls into a small, rounded mug with a soft belly and a slightly narrower rim. Keep the walls around 5 mm. Compress the rim, then wire underneath and lift it onto a board." },
      { title: "Throw the sugar bowl and snack bowl", description: "Re-centre the top of the hump and throw a small rounded bowl for sugar (around 150 g). Wire it off, then throw the snack bowl in a slightly different shape and size. The small differences are the charm of this technique." },
      { title: "Throw the milk jug", description: "From the last of the clay at the top, throw a tiny cup for the milk (around 80 g). While it's still soft, pinch a small pouring lip with your thumb and forefinger so it pours cleanly." },
      { title: "Pull and attach the handle", description: "Pull a small handle from a thick coil, wetting your hands as you smooth it. Score and slip the attachment points on the mug, press the handle in firmly and blend the join, supporting the mug from inside." },
      { title: "Trim and dry", description: "Once leather-hard, trim a neat foot ring on each piece so they all sit level. Dry the set slowly under loose plastic for a few days, then uncover until bone dry." },
      { title: "Bisque fire", description: "Bisque fire to cone 06. It's a lovely moment to line the pieces up and see them as a family before glazing." },
      { title: "Glaze and final fire", description: "Wax the foot rings, then dip or brush each piece in the shiny glaze. An even coat brings out the glossy, almost metallic finish, especially around the curves of the mug. Glaze fire to the temperature recommended for your clay and glaze.", note: "Pair it with your favourite beans and a small sweet treat. Cortado optional but highly recommended." }
    ]
  },
  {
    id: "geometric",
    name: "Geometric",
    techniques: ["Wheel-thrown", "Hand-built"],
    purpose: "Decorative",
    estimatedTime: "6–8 hours",
    images: [geometricTrio, geometricRed, geometricNatural],
    story: [
      "This collection started as an experiment with shape and ended up feeling almost ancient. The bowls are decorative, made to live as ornaments around the house, but their silhouettes seem to come from another time. The one with straighter, faceted edges looks a bit like a fish. That wasn't intentional, but it gives the piece a modern, unusual character while still echoing very old soup bowls.",
      "I keep thinking of soup bowls when I look at them, and of that moment at the end of a meal when you pick the bowl up to drink the last spoonful. My sister did this constantly when we were kids and always got told off. Now my partner does it too, and it makes me laugh every time, because the original soup bowl was designed for exactly that. The handles disappeared over the centuries, but the gesture stayed.",
      "I made three, each a little different, all in terracotta clay. I kept the palette earthy: natural creams and a deep red that reminds me of the dyes in ancient pottery. One has two handles made from a grit clay, and it has the loveliest stone-carved feel, as if it's been sitting on a shelf for a few hundred years."
    ],
    materials: [
      "Terracotta clay (about 600 g per bowl)",
      "A small amount of grit / grogged stoneware clay for the textured handles",
      "Deep red terracotta slip or underglaze",
      "Clear or satin glaze (optional, for the interiors)",
      "Pottery wheel and trimming tools",
      "Surform / metal rib for faceting",
      "Wooden knife and loop tools",
      "Score tool and slip"
    ],
    steps: [
      { title: "Throw the bowl form", description: "Wedge around 600 g of terracotta clay and centre it. Open a low, rounded bowl with thick enough walls to carve into later. Keep the rim narrow compared to the belly. That's what gives it the ancient, vessel-like shape." },
      { title: "Trim and facet (the 'fish' bowl)", description: "Once leather-hard, flip the bowl and trim a small foot. For the angular one, use a surform or metal rib to carve flat facets around the body, working from rim to foot in even planes. The straight edges are what give it the fish-like profile." },
      { title: "Cut and shape the handles", description: "Roll a slab of terracotta about 8 mm thick and cut two triangles or diamonds. Punch a clean round hole through the centre of each with a circular cutter. For the stone-feel pair, do the same with grit clay so the texture stays raw and speckled.", note: "Mixing clay bodies works best when both are at the same leather-hard stage. Too wet and they'll pull apart as they dry." },
      { title: "Attach the handles by hand", description: "Score and slip the sides of the bowl and the inner edge of each handle. Press them firmly in place while supporting the bowl from inside, and blend the joins with a wooden tool. Keep the handles wide and flat so they read as wings rather than grips." },
      { title: "Colour with terracotta slip", description: "While still leather-hard, brush the deep red slip over the bowls you want to colour. Two or three thin coats give a rich, dye-like depth without hiding the clay. Leave the natural and grit-clay pieces bare.", note: "On the red piece, let the slip pool slightly along the facets. It deepens the colour where the light catches the angles." },
      { title: "Dry slowly and bisque fire", description: "Dry the bowls under loose plastic for several days so the handles and bodies shrink together without cracking. Once bone dry, bisque fire to cone 06." },
      { title: "Optional interior glaze", description: "For a sealed interior (useful if you ever drink from them), brush a thin coat of clear or satin glaze inside only. Keep the outside raw so the terracotta and slip stay matte and earthy. Glaze fire to the temperature recommended for your clay.", note: "The unglazed outside is what keeps that ancient, stone-carved feel. The grit-clay handles look best left matte." }
    ]
  }
];

export const allTechniques: Technique[] = [
  "Hand-built", "Wheel-thrown", "Slab-building"
];

export const allPurposes: Purpose[] = ["Functional", "Decorative", "Sculptural", "Lighting"];

export const allDifficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
