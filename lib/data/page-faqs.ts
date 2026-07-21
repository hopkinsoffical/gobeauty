import type { FaqItem } from "@/lib/types";

/** Page-level FAQs for GEO (5–8 items each) + FAQPage JSON-LD on key channels. */

export const FAQ_GET_THIS_LOOK: FaqItem[] = [
  {
    q: "What is Get This Look on goBeauty.ai?",
    a: "Get This Look is goBeauty’s AI beauty-path tool. Upload a photo or describe a goal and the system decodes the look, then recommends whether to DIY, book a professional, or shop pro-recommended products — with concrete next steps for each path.",
  },
  {
    q: "What kinds of beauty photos can I upload?",
    a: "You can upload looks for nails, hair, skin, makeup, lashes and brows, K-beauty styles, and similar beauty goals. Clear, well-lit photos without heavy filters produce the most accurate analysis.",
  },
  {
    q: "Does Get This Look book a salon for me?",
    a: "Get This Look tells you if a pro is the better path and helps you discover relevant services and local options. Final booking usually happens on the salon’s own site, phone, or booking tool.",
  },
  {
    q: "Is Get This Look free to use?",
    a: "Core photo analysis and Beauty Path recommendations are free for consumers. Some saved-profile or business features may require sign-in. Product purchases follow the prices shown on each product page.",
  },
  {
    q: "How accurate is the AI look analysis?",
    a: "The model identifies structure, style cues, and likely techniques from the image and goal text. It is a planning aid, not a medical diagnosis. Complex salon techniques may still need a licensed professional to execute safely.",
  },
  {
    q: "Can I chat after I upload a look?",
    a: "Yes. After the structured breakdown, you can ask follow-up questions in the analyze chat to refine DIY steps, product ideas, or whether a salon visit makes more sense for your budget and skill level.",
  },
  {
    q: "What happens to photos I upload?",
    a: "Photos are processed to generate your Beauty Path. Retention and privacy details are in the Privacy Policy. Only upload images you have the right to use, and avoid photos of people who have not consented.",
  },
];

export const FAQ_SKIN_ANALYZER: FaqItem[] = [
  {
    q: "What is the goBeauty Skin Analyzer?",
    a: "The Skin Analyzer is a free cosmetic skin scan. Upload a selfie to get scores for concerns like oiliness, dryness, redness, pores, spots, and fine lines, plus product directions and nearby skincare pro suggestions when relevant.",
  },
  {
    q: "Is the Skin Analyzer a medical diagnosis?",
    a: "No. Results are for cosmetic education and shopping guidance only. They are not a substitute for a dermatologist or medical care. See a licensed clinician for diagnosis, prescriptions, or treatment of skin disease.",
  },
  {
    q: "How should I take a selfie for the best scan?",
    a: "Use even front lighting, face the camera, remove heavy filters, and keep hair off the forehead and cheeks. A neutral expression and clean lens help the model read texture and tone more consistently.",
  },
  {
    q: "What scores does the Skin Analyzer report?",
    a: "Typical cosmetic scores include oiliness, dryness, redness, visible pores, spots or discoloration, and fine lines. Exact labels can expand as the model improves. Each score is meant to guide product or pro recommendations, not clinical grading.",
  },
  {
    q: "How are product recommendations chosen?",
    a: "Recommendations map concern scores to product directions and catalog matches where available — for example barrier support for dryness or gentle clarifying options for oiliness — with ingredient-aware picks when data is present.",
  },
  {
    q: "When should I see a skincare professional instead?",
    a: "Book a pro or dermatology visit for sudden rashes, severe acne, wounds, infections, or any concern that is painful, spreading, or not improving. The analyzer will sometimes flag that a salon or clinical path is better than DIY products alone.",
  },
  {
    q: "Is my selfie stored permanently?",
    a: "Images are used to run the scan and show results. How long media is kept and how it may be used to improve the product is described in the Privacy Policy. You can use the tool without treating it as a medical record system.",
  },
];

export const FAQ_MARKETPLACE: FaqItem[] = [
  {
    q: "What is Products for Salons on goBeauty?",
    a: "Products for Salons is goBeauty’s professional marketplace for salon and spa buyers. Discover treatments, aftercare, retail, samples, equipment demos, and private-label opportunities from beauty suppliers through inquiry-led discovery.",
  },
  {
    q: "Who can use the salon product marketplace?",
    a: "It is built for salon owners, spa operators, and beauty professionals sourcing backbar or retail lines, and for brands or suppliers who want to reach those buyers. Consumers shopping personal products should use the main product library instead.",
  },
  {
    q: "Can I check out multiple suppliers in one cart?",
    a: "The marketplace focuses on discovery and lead generation rather than a multi-supplier cart. Browse products and suppliers, then request information, samples, or demos from the brands that fit your menu.",
  },
  {
    q: "How do I find samples or starter kits?",
    a: "Use marketplace filters and “looking for” cards for samples and starter kits, or search for sample-oriented lines. Open a supplier or product card and submit an inquiry to ask about kits, MOQs, and availability.",
  },
  {
    q: "How can a brand list products on goBeauty?",
    a: "Suppliers and brands can use List Your Products to submit catalog details. Approved listings appear in salon-facing discovery so owners can find treatments, retail, equipment, and private-label options.",
  },
  {
    q: "What product categories are available?",
    a: "Common use cases include professional treatments and backbar, client aftercare, retail to sell in-store, samples and starter kits, equipment demos, and private-label conversations. Coverage grows as more suppliers join.",
  },
  {
    q: "Is the marketplace free for salon owners?",
    a: "Browsing suppliers and submitting product inquiries is designed to be free for salon buyers. Supplier listing or premium brand programs may have separate commercial terms disclosed during onboarding.",
  },
  {
    q: "How is this different from consumer product shopping?",
    a: "Consumer shopping focuses on personal-use products, ingredients, and compare tools. Products for Salons targets professional purchasing decisions — backbar, retail assortment, samples, and supplier relationships for a business.",
  },
];
