import mixingGlazes1 from "@/assets/piece-mixing-glazes-1.jpg";
import mixingGlazes2 from "@/assets/piece-mixing-glazes-2.jpg";
import mixingGlazes3 from "@/assets/piece-mixing-glazes-3.jpg";
import coneLamp1 from "@/assets/piece-cone-lamp-1.png";
import coneLamp2 from "@/assets/piece-cone-lamp-2.jpg";
import coneLamp3 from "@/assets/cone-lamp-2.jpg";
import coneLampHero from "@/assets/cone-lamp-hero.jpg";
import coneLampSketch from "@/assets/cone-lamp-sketch.jpg";
import unusualJugs1 from "@/assets/piece-unusual-jugs-1.png";
import candleHolder1 from "@/assets/piece-candle-holder-1.png";
import candleHolder2 from "@/assets/piece-candle-holder-2.png";
import fondueSet from "@/assets/piece-fondue-party-set.png";
import fondueCheese from "@/assets/piece-fondue-party-cheese.jpg";
import elevatedHero from "@/assets/piece-elevated-delights-stands-trio.png";
import elevatedTrio from "@/assets/piece-elevated-delights-IMG_4327.jpg";
import elevatedPastries from "@/assets/piece-elevated-delights-IMG_4311.jpg";
import elevatedWheel from "@/assets/piece-elevated-delights-IMG_1695.jpg";
import elevatedParts from "@/assets/piece-elevated-delights-IMG_1699.jpg";
import fantasyLampLit from "@/assets/piece-fantasy-lamp-lit.png";
import fantasyLampFull from "@/assets/piece-fantasy-lamp-IMG_3931.jpg";
import fantasyLampTexture from "@/assets/piece-fantasy-lamp-IMG_3934.jpg";
import fantasyLampCable from "@/assets/piece-fantasy-lamp-IMG_3927.jpg";
import afternoonCoffeeMug from "@/assets/piece-afternoon-coffee-IMG_4334.jpg";
import afternoonCoffeeTable from "@/assets/piece-afternoon-coffee-IMG_4338.jpg";
import afternoonCoffeeLineup from "@/assets/piece-afternoon-coffee-IMG_4332.jpg";
import afternoonCoffeeBisque from "@/assets/piece-afternoon-coffee-IMG_3971.jpg";
import geometricTrio from "@/assets/piece-geometric-trio.png";
import geometricRed from "@/assets/piece-geometric-IMG_0893.jpg";
import geometricNatural from "@/assets/piece-geometric-natural-red.png";

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
      "There is something so lovely about the parallel between cooking and working with clay. Both are all about experimenting, playing with raw ingredients, and seeing how they transform when things get hot. This little set was born from that exact spirit of curiosity. Each piece has its own unique shape and natural movement, which is exactly how I wanted it—imperfect, organic, and full of life.",
      "The real fun started when I began playing around with the glazes. Instead of keeping things uniform, I wanted to see what would happen if I layered them. I paired a glossy, transparent glaze over a soft matte color just to see how they would interact. Would they complement each other, or would they push each other away? Where they overlap, they created this gorgeous, unexpected third color and a completely new texture. I also added a subtle pattern to the plate, and it's amazing how this specific glaze completely transformed the surface. It feels incredibly artistic, like a little surprise every time the light hits it.",
      "I have to admit, I've completely fallen in love with this set. In my own kitchen, it lives right next to the hob. I always have it on hand to mix up different spices, and I use the matching little cup to store all the tools I use for crushing and blending them."
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
      { title: "Throw the bowl", description: "Wedge 400 g of stoneware clay to remove any air bubbles. Centre it on the pottery wheel and open up into a wide, shallow bowl form with walls about 6 mm thick. Pull the walls up in 2–3 steady lifts and smooth the curve with a sponge.", note: "Keep your hands wet but not dripping. The clay should feel like it's moving with you, not fighting." },
      { title: "Throw the cup", description: "Wedge 600 g of stoneware clay and centre it on the wheel. Open the form and pull the walls up taller and straighter than the bowl, keeping them an even 6 mm thick. Refine the rim with a damp sponge." },
      { title: "Throw the small bowl", description: "Wedge 200 g of stoneware clay and centre it on the wheel. Open into a small, deeper bowl form to act as the matching little cup of the set. Once leather-hard, trim a neat foot ring with the trimming tools." },
      { title: "Build the plate from a slab", description: "Roll out 800 g of stoneware clay into a slab about 6 mm thick. Cut it into a rectangle, then gently shape and lift the edges to create a soft, wavy effect around the rim. Use the pattern roller across the centre to press in a subtle texture." },
      { title: "Dry and bisque fire", description: "Let all four pieces dry slowly and evenly over 3–5 days until bone dry. Load them into the kiln and bisque fire to cone 06 (approximately 1000 °C). Once cool, paint wax resist on the foot rings and bases." },
      { title: "Layer the glazes", description: "Apply the amber celadon glaze as a soft matte base coat on each piece. Once dry, layer the transparent glaze over the top, overlapping in places so the two interact. Where they meet, they'll create an unexpected third colour and a completely new texture.", note: "The thickness of each glaze layer matters enormously. Too thin and the colours wash out; too thick and they run. Aim for the consistency of single cream." },
      { title: "Glaze fire", description: "Load the pieces carefully onto kiln stilts. Fire to cone 6 (approximately 1220 °C) with a slow ramp in the final 100 °C. Allow the kiln to cool naturally—don't peek for at least 12 hours.", note: "Patience here is everything. Rapid cooling can cause crazing in the glaze surface." }
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
      "This cone lamp was inspired by a moment I look forward to every single day from my balcony. As the sun begins to set, the sky shifts into this deep, beautiful evening blue. From my apartment, I watch that twilight sky meet the warm, earthy tones of the brick buildings below. I wanted to capture that exact transition of light and colour, so I designed this piece with a rich blue top cone that gently meets a warm, earthy brown base. For me, this lamp represents that soft, comforting glow settling over the city at the end of the day.",
      "But the real magic happens when you bring it inside. In my own home, I use a smart bulb that automatically clicks on right as the sun goes down. Watching the lamp glow just as the actual sky is changing makes it feel like so much more than just a light source—it becomes a whole experience. It's a gentle reminder to slow down, transition into the evening, and bring a piece of that calm, outdoor sunset right into your living space.",
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
      { title: "Prepare the clay", description: "Wedge the toffee clay thoroughly to remove any air pockets. It should feel smooth and consistent throughout before you take it to the wheel." },
      { title: "Throw the cone form", description: "Using about 800 g of the toffee clay, centre it and begin pulling up into a tall, narrow cone shape. The walls should taper from about 5mm at the base to 2–3mm at the top. Work slowly and steadily.", note: "If the form starts to wobble, slow the wheel speed. The clay responds to patience." },
      { title: "Create the base", description: "With the remaining 1.2 kg of clay, throw a separate shallow dish form to serve as the lamp base. This should be wide enough to provide stability (about 12cm diameter) and have a central channel for the cord." },
      { title: "Trim and cut the cord holes", description: "When leather-hard, trim both pieces carefully and even out the walls. While the clay is still soft enough to cut cleanly, carve out the cord holes in both the top cone and the base so the cable and bulb holder can pass through later—no drilling needed once fired." },
      { title: "Bisque fire", description: "Dry the clay very slowly over 5–7 days to prevent cracking. Support the cone with kiln posts during bisque firing to cone 06." },
      { title: "Apply the two glazes and final fire", description: "Glaze the top cone in the deep blue and the base in the warm earthy brown, keeping a clean line where the two meet. Fire to cone 10 (approximately 1300°C)." },
      { title: "Sand and assemble", description: "Sand the base of both pieces with progressively finer grits until smooth. Thread the cable through the pre-cut holes and fit the E27 bulb holder." }
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
      "These jugs began as a rebellion against uniformity. I'd spent a week throwing identical mugs for a commission and my hands were craving something looser, more intuitive. I wanted each jug to have its own character—like they were siblings, not clones.",
      "The handles were the most fun. Instead of pulling traditional handles, I experimented with coiled and flattened forms, attaching them at unexpected angles. Some look more practical than others, and that's entirely the point.",
      "I think there's something deeply human about imperfection in functional objects. When you pour milk from a jug that leans slightly left, you develop a relationship with that object. These jugs are an invitation to embrace the wonky."
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
      { title: "Throw the jug bodies", description: "Centre and throw three jug forms, deliberately varying the proportions. One tall and narrow, one round and squat, one somewhere between. Aim for walls around 5–6mm thick. Don't worry about making them identical—that's the whole point." },
      { title: "Form the spouts", description: "While the clay is still soft on the wheel, use your thumb and forefinger to gently coax a pouring lip on each jug. Each spout should have a different character—one generous, one precise, one playful." },
      { title: "Pull and attach handles", description: "Pull handles from a thick coil of clay, wetting your hands and smoothing as you pull. Score attachment points on the jug body and press the handle firmly into place. If needed, you can use some watered-down clay to help stick. Support from inside while attaching.", note: "Let the handles develop their own curve as you pull them. The clay will tell you what shape it wants to be." },
      { title: "Dry and bisque fire", description: "Dry slowly under plastic for 2 days, then uncover for another 2–3 days. Fire your piece." },
      { title: "Glaze with earth tones", description: "Choose a different glaze for each jug to enhance their individual personalities. Dip, pour, or brush the glaze—each application method gives a different finish. Fire your piece." }
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
      "I wanted to create a piece that feels just as beautiful during the quiet afternoon hours as it does at night. This candle holder has a very rustic, grounded feel, finished in a soft, neutral beige that sits peacefully on your shelf or table all day long. It blends seamlessly into the room, acting as a calm, artistic little ornament while the sun is up.",
      "But the real transformation happens when the evening rolls in and you light the candle inside. Suddenly, the piece completely comes alive. The flame casts these stunning, intricate patterns across your walls, almost like looking through a beautifully shaped stained-glass window. It fills the room with this dancing, ambient light that feels deeply meditative and calming. It's the perfect companion for winding down, turning your space into a warm, beautiful sanctuary at the end of the day."
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
      { title: "Roll and cut the slab", description: "Roll your clay into an even slab about 5mm thick using wooden guides on either side. Cut a rectangle approximately 25cm × 12cm—this will wrap into your cylinder." },
      { title: "Mark and cut the lattice", description: "Using a ruler, lightly score a diagonal grid across the slab at 45-degree angles, spacing lines about 2cm apart. Then carefully cut out alternating diamond shapes with a sharp knife. Leave solid clay at the top and bottom edges (about 2cm) for structural integrity.", note: "Work on a slightly firm slab—too soft and the cuts will distort; too hard and the clay will crack." },
      { title: "Form the cylinder", description: "Score and slip the short edges of the slab. Carefully bend the slab into a cylinder, pressing the join firmly together. Smooth the seam on both inside and outside." },
      { title: "Add the base", description: "Roll a small circle of clay slightly larger than the cylinder opening. Score and slip both surfaces, then attach the base. Trim flush and smooth the join." },
      { title: "Dip the rim in white slip", description: "Once leather-hard, dip the top third of the holder into white slip. This creates the two-tone effect—terracotta below, cream above." },
      { title: "Fire and glaze", description: "Bisque fire to cone 06. Apply a clear glaze over the entire piece to seal the surface and make it heat-safe. Glaze fire to cone 6. Place a tea light inside and enjoy the shadow patterns.", note: "Always use the candle holder on a heat-safe surface and never leave burning candles unattended." }
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
      "This set came straight from my love of hosting and bringing people together around the table. There is something so special about sharing food from dishes you've made with your own hands—it turns a simple evening into an occasion. I wanted to make a fondue set that felt warm, welcoming, and a little bit playful, the kind of piece you'd pull out whenever friends come over.",
      "The clay itself is called Puntitos and it's genuinely one of my favourites to work with. It has these lovely little dark flecks running all the way through it, almost like freckles in the surface. Because the clay is already doing so much of the visual work, I kept the finish really simple with just a soft white matte glaze. It lets the speckles shine through and gives the whole set a calm, understated look.",
      "I made the full set on the wheel: a sturdy base with a cut-out for a tea light, a bowl that sits neatly on top to hold your cheese or chocolate, and a handful of little side bowls for bread, fruit, and anything else you fancy dipping. To make it work on a smaller table like mine, I also threw a set of cake stands that doubles up as elevated serving for sides—they give you that extra layer of space so nothing feels crowded. You can find those in the matching collection."
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
      { title: "Throw the base", description: "Wedge about 600 g of Puntitos clay and centre it on the wheel. Throw a sturdy, slightly tapered cylinder open at the top, with walls around 7–8 mm thick so it stays stable when the bowl sits on top. Keep the rim flat and even so the bowl above has a clean surface to rest on.", note: "A heavier base feels more grounded on the table and gives you room to cut the candle opening later without weakening the form." },
      { title: "Throw the top bowl", description: "Wedge around 800 g of clay and centre it. Open into a generous bowl shape with a small lip or step on the underside of the rim so it can sit securely on top of the base. Check the fit against your base while both are still soft, adjusting the diameter so it nests neatly without wobbling." },
      { title: "Throw the side bowls", description: "Using 150–200 g of clay each, throw a few smaller bowls for bread and dippers. Vary them slightly in size and depth so the set feels handmade and characterful rather than uniform." },
      { title: "Cut the candle opening", description: "Once the base is leather-hard, mark and carefully cut an arched opening near the bottom of the cylinder with a sharp knife. Make it large enough to slide a tea light in and out comfortably, and to let air flow so the flame stays lit. Smooth the cut edges with a damp sponge." },
      { title: "Trim and refine", description: "Trim foot rings on the bowls and tidy the base when everything reaches leather-hard. Test the stack again—base, top bowl, side bowls—and adjust any rims that don't sit quite right." },
      { title: "Dry and bisque fire", description: "Dry the whole set slowly and evenly over several days until bone dry. Bisque fire to cone 06 so the speckles in the clay start to show through." },
      { title: "Glaze and final fire", description: "Apply the white matte glaze in an even coat across all the pieces, letting the natural flecks of the Puntitos clay peek through the surface. Wax the foot rings and the underside of the top bowl's lip so it doesn't fuse to the base. Glaze fire to the temperature recommended for your clay and glaze pairing.", note: "Pair the finished set with the matching cake stands from the collection for extra serving height when your table is tight on space." }
    ]
  },
  {
    id: "elevated-delights",
    name: "Elevated Delights",
    techniques: ["Wheel-thrown"],
    purpose: "Functional",
    estimatedTime: "4–6 hours",
    images: [elevatedTrio, elevatedPastries, elevatedHero],
    processImages: [elevatedWheel, elevatedParts],
    story: [
      "The story behind these cake stands is all about hosting. When you've spent the afternoon laying out a beautiful spread for a dinner party, there's never quite enough room on the table for everything. These elevated plates let you use your favourite ceramics while giving every dish its own little stage—and freeing up precious space underneath for more.",
      "They've also become part of a ritual I've adopted since moving to Spain: La Merienda. It's that lovely afternoon pause—a coffee, a tea, or a mate paired with something sweet—a bit like the British idea of afternoon tea. These stands feel made for it. In the photos you can see some of my favourite treats on them: pastéis de nata (I recently brought some back from Belém, and they really are as good as everyone says), and the medialunas from Alfa, which living in Barcelona has become one of our go-to options.",
      "There are three stands in this collection, and I used two different methods to make them. One is thrown in a single piece on the wheel, pulling the sides up and forming the stem directly from the same lump of clay. The other two are made in parts—two plates and two hollow cylinders thrown separately, then scored, slipped, and joined together once they reach leather-hard."
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
      { title: "Method 1 — Throw the one-piece stand", description: "Wedge around 500 g of clay and centre it on the wheel. Open it into a wide, shallow plate, then gather the clay at the centre and pull it upward to form the stem from the same piece. Keep the walls of the stem even and the plate level on top.", note: "Working from a single piece takes more control, but the join between plate and stem is seamless—no risk of cracking later." },
      { title: "Method 2 — Throw the plates", description: "For the other two stands, throw two shallow plates on the wheel using around 400 g each. Aim for an even thickness and a slightly raised rim so the food sits neatly. Set them aside to firm up to soft leather-hard." },
      { title: "Method 2 — Throw the hollow cylinders", description: "Throw two short, hollow cylinders to serve as the stems—around 200 g each. Keep them open at both ends and slightly tapered for a more elegant silhouette. Make sure the top diameter matches roughly where you want it to meet the plate." },
      { title: "Trim and refine", description: "Once everything is leather-hard, trim the foot of the one-piece stand and tidy the plates and cylinders. Check that each plate sits level and that the cylinder rims are flat enough to take a clean join." },
      { title: "Score, slip, and join", description: "For the two-part stands, score the centre underside of each plate and the top rim of its cylinder. Apply slip generously, press them together, and gently work the join with a damp finger or rib to smooth and reinforce it.", note: "Take your time aligning the stem before pressing—once joined, it's tricky to nudge it back to centre." },
      { title: "Dry slowly and bisque fire", description: "Cover the stands loosely with plastic and let them dry slowly over several days, especially around the joins, to prevent cracking. Once bone dry, bisque fire to cone 06." },
      { title: "Glaze and final fire", description: "Brush or dip in a soft white speckled glaze, letting the flecks in the clay show through. Wax the foot rings before glazing. Glaze fire to the temperature recommended for your clay and glaze pairing." }
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
      "This little lamp is one of my favourite pieces to look at. There's something about its silhouette and texture that makes it feel almost natural—like something that quietly grew on the floor of a fantasy forest rather than anything I made on a wheel. It feels mythical, and that was really the whole point: natural and mythical, somewhere between a mushroom, a pinecone, and a tiny enchanted lantern.",
      "I threw it in two parts on the wheel—a bulbous top and a sturdier bottom—then scored, slipped, and joined them while they were still soft enough to move together. Once the form was settled, I went over the entire outside with a loop tool, carving little pebble-like marks all around it. That texture is what really brings the piece to life, especially when the light catches it from above and the shadows pool inside each scoop.",
      "What I love is how flexible it is. You can drop a candle inside and use it as a candle holder, or fit it with a lamp cable and turn it into a proper little table lamp. For the wiring I'd recommend an E14 fitting because the opening is on the smaller side, but an E27 will still work if that's what you have on hand."
    ],
    materials: [
      "Around 1.2–1.5 kg stoneware clay",
      "Pottery wheel and trimming tools",
      "Loop tool or carving tool for the pebble texture",
      "Needle tool, scoring tool, and slip for joining",
      "Sponge and water",
      "Soft satin or clear glaze (optional—left raw also works beautifully)",
      "E14 lamp cable with bulb fitting (E27 also works), or a tea light for candle use"
    ],
    steps: [
      { title: "Throw the bottom section", description: "Wedge around 600–700 g of clay and centre it on the wheel. Throw a sturdy, slightly tapered cylinder with a narrower waist at the top, leaving the top open so it can be joined to the second piece later. Keep the walls a generous 7–8 mm—you'll be carving into them." },
      { title: "Throw the bulbous top", description: "Wedge a similar amount of clay and throw a rounded, almost onion-shaped form with a small opening at the top and a wider opening at the bottom that matches the diameter of the lower section. Keep wall thickness consistent so the two halves will move together as one once joined." },
      { title: "Join the two pieces", description: "Once both parts have firmed up to soft leather-hard, score and slip the matching rims, press them together, and gently weld the seam with a rib and your fingers. Smooth the join from the outside so it disappears into the overall silhouette.", note: "Cover loosely with plastic for a few hours after joining so the two halves equalise in moisture—this prevents the join from cracking later." },
      { title: "Carve the texture", description: "Working from the top down, use a small loop tool to carve little pebble-shaped marks across the entire outer surface. Let the marks follow the curves of the form so the texture feels organic rather than rigid. Vary the depth slightly for more shadow play when it's lit.", note: "Keep the clay at firm leather-hard for clean, crisp scoops—too wet and the marks smear, too dry and they chip." },
      { title: "Cut the cable opening", description: "On the bottom section, mark and cut an arched opening large enough for a lamp cable or a tea light to slide through. Smooth the cut edges with a damp sponge so they look intentional and clean." },
      { title: "Dry slowly and bisque fire", description: "Cover loosely with plastic and let the lamp dry slowly and evenly over several days, paying extra attention to the join. Once bone dry, bisque fire to cone 06." },
      { title: "Glaze (optional) and final fire", description: "You can leave it raw for a soft, earthy finish, or brush a thin satin or clear glaze over the texture to bring out the highlights. Glaze fire to the temperature recommended for your clay." },
      { title: "Wire it up (or light a candle)", description: "Fit an E14 lamp cable and a low-wattage bulb through the bottom opening for a soft, warm glow up through the top. An E27 also works if that's what you have. Prefer candlelight? Drop a tea light inside instead and enjoy the shadows the carved texture throws across the walls.", note: "If you're wiring it as a lamp, use a low-heat LED bulb and have any electrical work checked by someone qualified—ceramics don't dissipate heat the way a standard lampshade does." }
    ]
  },
  {
    id: "afternoon-coffee-for-one",
    name: "Afternoon Coffee for One",
    techniques: ["Wheel-thrown"],
    purpose: "Functional",
    estimatedTime: "4–5 hours (plus drying and firing)",
    images: [afternoonCoffeeMug, afternoonCoffeeTable, afternoonCoffeeLineup],
    processImages: [afternoonCoffeeBisque],
    story: [
      "This little set is built around one of my favourite moments of the day: the afternoon coffee. I usually go for a cortado—an espresso cut with just a splash of oat milk—and I wanted a set of pieces that turn that small daily ritual into something a bit more intentional. There's a mug for the coffee, a tiny jug for the milk, a small bowl for sugar, and another little bowl for the after-lunch chocolate or snack. Everything you need for one person, one quiet pause.",
      "I made the whole set using a technique called throwing off the hump. It was only the second time I'd tried it, and it's genuinely tricky—you keep one big lump of clay centred on the wheel and throw piece after piece off the top, slicing each one free with a wire before starting the next. Mine came out in slightly different sizes (which I love), and once I had them all lined up I thought: what is this set actually for? The afternoon timing answered the question for me—it became a cortado set.",
      "I'm completely in love with the glaze on these. It's a really natural, warm tone, but incredibly shiny, almost metallic where the light catches it—especially on the mug, where the angle at the top picks up these gorgeous reflections. Recently we had family visiting and they brought us specialty coffee from Costa Rica and dulce de leche treats from Mexico, which the set held beautifully. If you haven't picked up on it yet: coffee is a big part of my day, and this little set just brings some extra joy to that moment."
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
      { title: "Centre the hump", description: "Wedge your whole lump of clay (around 1.2 kg) and centre it on the wheel as one tall, stable mound. You'll be working off the very top of this hump, so focus on getting the upper portion perfectly centred rather than the whole mass.", note: "Throwing off the hump is more about control than strength. Keep your hands relaxed and only work the small amount of clay you need for each piece." },
      { title: "Throw the mug", description: "Open just the top portion of the hump—around 250 g of clay—and pull up the walls into a small, rounded mug form with a soft belly and a slightly narrower rim. Keep walls even at around 5 mm. Compress the rim, then slice underneath with a wire and lift it gently off the hump onto a board." },
      { title: "Throw the sugar bowl and snack bowl", description: "Re-centre the top of the hump and throw a small rounded bowl for sugar (around 150 g of clay). Wire it off, then repeat with a slightly different shape and size for the snack bowl. Embrace the small variations between them—that's the charm of throwing off the hump." },
      { title: "Throw the milk jug", description: "From the last of the clay at the top of the hump, throw a tiny cup for the milk (around 80 g). While it's still soft, gently pinch a small pouring lip on the rim with your thumb and forefinger so it pours cleanly." },
      { title: "Pull and attach the handle", description: "Pull a small handle from a thick coil of clay, wetting your hands as you smooth it out. Score and slip the attachment points on the mug, press the handle in firmly, and support from inside while you blend the join." },
      { title: "Trim and dry", description: "Once everything is leather-hard, trim a neat foot ring on each piece so they sit level on the table together. Dry the whole set slowly under loose plastic for a few days, then uncover until bone dry." },
      { title: "Bisque fire", description: "Bisque fire the set to cone 06. This is also a lovely moment to line them up and see them as a family before the glaze goes on." },
      { title: "Glaze and final fire", description: "Wax the foot rings, then dip or brush each piece in the shiny natural-toned glaze. Aim for an even coat so the glossy, almost metallic quality comes through, especially around the curves of the mug where the light will hit. Glaze fire to the temperature recommended for your clay and glaze pairing.", note: "Pair it with your favourite beans and a small sweet treat. Cortado optional but highly recommended." }
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
      "This little collection started as an experiment with shape and felt almost ancient by the time it was finished. The bowls are decorative, designed to live as ornaments around the house, but there is something about their silhouettes that feels pulled out of another time. The one with the straighter, faceted edges almost looks like a fish—completely unintentional, but it gives the piece a modern, unusual character while still echoing the shape of very old soup bowls.",
      "I keep coming back to the idea of a soup bowl when I look at them. The shape works for soup, for drinks, maybe for something ceremonial—but mostly I think of that moment at the end of a meal when you can't quite get the last spoonful and you pick the bowl up to drink it. My sister did this constantly when we were kids and always got told off for it. Now my partner does the same thing, and it makes me laugh every time, because the original soup bowl was actually designed for exactly that. The handles slowly disappeared over the centuries, but the gesture stayed.",
      "I made three of them, each a little different. I kept the palette close to the earth—natural creams and a deep, dark red that reminds me of dyes used in ancient pottery. They're all built on terracotta clay. One of them has two hand-built handles made from a grit clay, attached by hand, and that one has the loveliest stone-carved feeling about it, as if it had been quietly sitting on a shelf for a few hundred years."
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
      { title: "Throw the bowl form", description: "Wedge around 600 g of terracotta clay and centre it on the wheel. Open into a low, rounded bowl with generous walls so there is enough body to carve into later. Keep the rim narrow compared to the belly—it gives the piece its ancient, vessel-like silhouette." },
      { title: "Trim and facet (the 'fish' bowl)", description: "Once leather-hard, flip the bowl and trim a small foot. For the angular one, use a surform or metal rib to carve flat facets around the body, working from the rim down to the foot in even planes. The straighter edges are what give it that unintentional fish-like profile." },
      { title: "Cut and shape the handles", description: "For the geometric handles, roll a slab of terracotta about 8 mm thick and cut two triangular or diamond shapes. Pierce a clean round hole through the centre of each with a circular cutter. For the stone-feeling pair, do the same with grit clay so the texture stays raw and speckled.", note: "Mixing clay bodies works best when both pieces are at the same leather-hard stage—too wet and they'll pull apart as they dry." },
      { title: "Attach the handles by hand", description: "Score and slip the sides of the bowl and the inner edge of each handle. Press them firmly in place, supporting the bowl from the inside, and blend the joins with a wooden tool. Keep the handles sticking out wide and flat so they read as wings rather than grips." },
      { title: "Colour with terracotta slip", description: "While still leather-hard, brush the deep red terracotta slip over the body of the bowls you want to colour. Two or three thin coats give that rich, dye-like depth without hiding the clay underneath. Leave the natural and grit-clay pieces bare to let the raw colour speak.", note: "On the red piece, let the slip pool slightly in the faceted edges—it deepens the colour where the light catches the angles." },
      { title: "Dry slowly and bisque fire", description: "Dry the bowls under loose plastic for several days so the hand-built handles and wheel-thrown bodies move together without cracking. Once bone dry, bisque fire to cone 06." },
      { title: "Optional interior glaze", description: "If you want a sealed interior—useful if you ever do use them for drinks—brush a thin coat of clear or satin glaze inside only, keeping the outside raw so the terracotta and slip stay matte and earthy. Glaze fire to the temperature recommended for your clay.", note: "Leaving the outside unglazed is what keeps the ancient, stone-carved feeling. The grit-clay handles especially come alive when they stay matte." }
    ]
  }
];

export const allTechniques: Technique[] = [
  "Hand-built", "Wheel-thrown", "Slab-building"
];

export const allPurposes: Purpose[] = ["Functional", "Decorative", "Sculptural", "Lighting"];

export const allDifficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
