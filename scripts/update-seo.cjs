const fs = require('fs');

const updates = {
  'vehicle-mileage': {
    title: 'Vehicle Mileage & Fuel Cost per Km Calculator | IndiaTools',
    metaDescription: 'Accurately calculate your car or bike mileage (km/L) and cost per kilometer with current Indian petrol and diesel prices. Free, fast, and instant.',
    canonicalPath: '/calculators/vehicle-mileage'
  },
  'fuel-cost': {
    title: 'Fuel Cost Calculator – Calculate Litres and Expense | IndiaTools',
    metaDescription: 'Calculate how much fuel in litres and rupees you need for any distance. Plan your car, bike, or truck fuel budget instantly.',
    canonicalPath: '/calculators/fuel-cost'
  },
  'trip-cost': {
    title: 'Road Trip Cost Calculator with FASTag Toll Split | IndiaTools',
    metaDescription: 'Calculate total road trip cost including fuel, highway toll charges, and per-person cost splitting.',
    canonicalPath: '/calculators/trip-cost'
  },
  'monthly-vehicle-running-cost': {
    title: 'Monthly Vehicle Running Cost & Ownership Calculator | IndiaTools',
    metaDescription: 'Calculate true monthly vehicle expenses including fuel, EMI, service maintenance, and insurance costs.',
    canonicalPath: '/calculators/monthly-vehicle-running-cost'
  },
  'petrol-vs-diesel': {
    title: 'Petrol vs Diesel Cost Calculator – Breakeven Analysis | IndiaTools',
    metaDescription: 'Compare petrol vs diesel car ownership economics to find your monthly breakeven driving distance and annual savings.',
    canonicalPath: '/calculators/petrol-vs-diesel'
  },
  'ev-vs-petrol': {
    title: 'EV vs Petrol Cost Calculator – 5-Year Ownership Savings | IndiaTools',
    metaDescription: 'Compare electric car running costs against petrol cars. Calculate running cost per km, yearly savings, and EV breakeven period.',
    canonicalPath: '/calculators/ev-vs-petrol'
  },
  'jcb-fuel-cost': {
    title: 'JCB Fuel Cost Calculator – Diesel Cost Per Hour | IndiaTools',
    metaDescription: "Calculate JCB and excavator diesel consumption, fuel cost per hour, daily fuel cost and monthly operating cost using your machine's actual fuel usage and diesel price.",
    canonicalPath: '/calculators/jcb-fuel-cost'
  },
  'vehicle-service-cost': {
    title: 'Vehicle Service Cost Planner – Car & Bike Maintenance | IndiaTools',
    metaDescription: 'Plan periodic car and bike service budgets, engine oil replacement costs, brake pad wear, and routine maintenance intervals.',
    canonicalPath: '/calculators/vehicle-service-cost'
  },
  'road-trip-planner': {
    title: 'Road Trip Cost Calculator India – FASTag Toll & Fuel Planner | IndiaTools',
    metaDescription: 'Calculate total road trip cost including fuel expenses, highway FASTag toll charges, and per-person split budgets.',
    canonicalPath: '/calculators/road-trip-planner'
  },
  'cement-calculator': {
    title: 'Cement Calculator – Bags Needed for Plastering & Slabs | IndiaTools',
    metaDescription: 'Calculate cement bags needed for wall plastering, brick masonry, flooring, and RCC slabs with dry-to-wet volume factors.',
    canonicalPath: '/calculators/cement-calculator'
  },
  'concrete-calculator': {
    title: 'Concrete Mix Calculator (M15, M20, M25) – Cement, Sand & Aggregate | IndiaTools',
    metaDescription: 'Calculate cement bags, sand in cubic feet (cft), and crushed stone aggregate in tons for standard M15, M20, and M25 nominal mix grades.',
    canonicalPath: '/calculators/concrete-calculator'
  },
  'brick-calculator': {
    title: 'Brick & AAC Block Calculator – Wall Quantity & Cost | IndiaTools',
    metaDescription: 'Calculate red clay bricks, fly ash bricks, or AAC blocks required for 4.5-inch and 9-inch brick walls with mortar allowance.',
    canonicalPath: '/calculators/brick-calculator'
  },
  'tile-calculator': {
    title: 'Floor & Wall Tile Calculator (2x2, 4x2) – Boxes & Wastage | IndiaTools',
    metaDescription: 'Calculate ceramic and vitrified floor and wall tiles, total boxes required, and wastage allowance based on room dimensions.',
    canonicalPath: '/calculators/tile-calculator'
  },
  'paint-calculator': {
    title: 'Wall Paint & Putty Calculator – Litres & Bucket Sizing | IndiaTools',
    metaDescription: 'Calculate interior and exterior paint litres, primer, and wall putty required for your home walls based on square footage.',
    canonicalPath: '/calculators/paint-calculator'
  },
  'construction-cost': {
    title: 'House Construction Cost & Material Calculator India | IndiaTools',
    metaDescription: 'Estimate residential house construction costs across basic, standard, and luxury specifications with material-wise civil breakdowns.',
    canonicalPath: '/calculators/construction-cost'
  },
  'excavator-cost': {
    title: 'Excavator Rental & Working Cost Calculator | IndiaTools',
    metaDescription: 'Calculate heavy excavator and earthmoving rental costs per hour, operator charges, diesel consumption, and site project budgets.',
    canonicalPath: '/calculators/excavator-cost'
  },
  'electricity-cost': {
    title: 'Electricity Cost Calculator – Estimate Power Usage & Cost | IndiaTools',
    metaDescription: 'Estimate electricity usage and running cost from appliance power, usage hours and electricity rate.',
    canonicalPath: '/calculators/electricity-cost'
  },
  'ac-electricity-cost': {
    title: 'AC Electricity Bill Calculator (1.5 Ton, 3 vs 5 Star) | IndiaTools',
    metaDescription: 'Calculate air conditioner electricity consumption in units (kWh) and monthly power bill based on tonnage, BEE star rating, and usage hours.',
    canonicalPath: '/calculators/ac-electricity-cost'
  },
  'fan-electricity-cost': {
    title: 'Ceiling Fan & BLDC Electricity Cost Calculator | IndiaTools',
    metaDescription: 'Compare standard induction fan electricity consumption with BLDC energy saving fans. Calculate annual power savings and bill reduction.',
    canonicalPath: '/calculators/fan-electricity-cost'
  },
  'inverter-backup': {
    title: 'Inverter Battery Backup Time Calculator (150Ah, 200Ah) | IndiaTools',
    metaDescription: 'Calculate home inverter backup duration in hours for 150Ah, 200Ah tubular batteries and find the right inverter capacity for your load.',
    canonicalPath: '/calculators/inverter-backup'
  },
  'solar-panel': {
    title: 'Solar Panel Calculator & PM Surya Ghar Subsidy | IndiaTools',
    metaDescription: 'Calculate required rooftop solar panel capacity in kW, roof area needed, and central government subsidy under PM Surya Ghar Muft Bijli Yojana.',
    canonicalPath: '/calculators/solar-panel'
  },
  'water-tank-capacity': {
    title: 'Water Tank & Sump Capacity Calculator (IS 1172) | IndiaTools',
    metaDescription: 'Calculate overhead Sintex water tank and underground RCC sump capacity in litres as per Indian IS 1172 standards based on family size.',
    canonicalPath: '/calculators/water-tank-capacity'
  },
  'lpg-usage': {
    title: 'LPG Cylinder Usage & Lifespan Calculator (14.2 kg) | IndiaTools',
    metaDescription: 'Calculate how many days your 14.2 kg domestic LPG cylinder will last based on burner count and daily cooking hours.',
    canonicalPath: '/calculators/lpg-usage'
  },
  'generator-fuel-cost': {
    title: 'Diesel Generator (DG Set) Fuel Cost Calculator | IndiaTools',
    metaDescription: 'Calculate diesel generator running cost per hour and daily diesel expense for 5 kVA to 62.5 kVA backup DG sets.',
    canonicalPath: '/calculators/generator-fuel-cost'
  },
  'salary-hike': {
    title: 'Salary Hike & In-Hand Pay Calculator (New Tax Regime) | IndiaTools',
    metaDescription: 'Calculate salary increment percentage, revised gross CTC, and estimated in-hand take home pay after your annual appraisal or job switch.',
    canonicalPath: '/calculators/salary-hike'
  },
  'in-hand-salary': {
    title: 'In-Hand Salary Calculator India – CTC to Take-Home Pay | IndiaTools',
    metaDescription: 'Calculate monthly take-home salary from annual CTC with EPF, Professional Tax, and Income Tax deductions under the New Tax Regime.',
    canonicalPath: '/calculators/in-hand-salary'
  },
  'emi-calculator': {
    title: 'Home & Car Loan EMI Calculator India | IndiaTools',
    metaDescription: 'Calculate monthly loan EMI, total interest payable, and loan amortization schedule for home, vehicle, and personal loans in India.',
    canonicalPath: '/calculators/emi-calculator'
  },
  'gst-calculator': {
    title: 'GST Calculator India (5%, 12%, 18%, 28%) | IndiaTools',
    metaDescription: 'Calculate GST amounts with 5%, 12%, 18%, and 28% slabs. Get instant CGST, SGST, and IGST breakdowns for Indian billing.',
    canonicalPath: '/calculators/gst-calculator'
  },
  'sip-calculator': {
    title: 'SIP Calculator – Mutual Fund Wealth & Returns | IndiaTools',
    metaDescription: 'Calculate expected wealth growth and maturity returns from monthly SIP mutual fund investments with compounding interest.',
    canonicalPath: '/calculators/sip-calculator'
  },
  'daily-wage': {
    title: 'Daily Wage & Overtime Calculator India | IndiaTools',
    metaDescription: 'Calculate daily wages, hourly overtime rates, and gross payout in accordance with Indian Factories Act and labor standards.',
    canonicalPath: '/calculators/daily-wage'
  },
  'percentage-calculator': {
    title: 'Percentage & Discount Calculator – Sale Price Formula | IndiaTools',
    metaDescription: 'Calculate discounts, percentage markups, price differences, and festival sale savings with instant formulas.',
    canonicalPath: '/calculators/percentage-calculator'
  },
  'experience-calculator': {
    title: 'Work Experience Calculator – Exact Years, Months & Days | IndiaTools',
    metaDescription: 'Calculate total work experience duration across multiple companies, career gap deductions, and service tenure for resumes and job forms.',
    canonicalPath: '/calculators/experience-calculator'
  },
  'cent-to-sqft': {
    title: 'Cent to Square Feet Converter – Land Area Calculator | IndiaTools',
    metaDescription: 'Convert cent to square feet and calculate land area quickly using this simple online land area converter.',
    canonicalPath: '/calculators/cent-to-sqft'
  },
  'acre-converter': {
    title: 'Acre to Cent & Square Feet Converter | IndiaTools',
    metaDescription: 'Convert acres to cents, guntha, bigha, square feet, and hectares with 100% accurate Indian regional land measurement conversion.',
    canonicalPath: '/calculators/acre-converter'
  },
  'carpet-area': {
    title: 'RERA Carpet Area vs Super Built-up Calculator | IndiaTools',
    metaDescription: 'Calculate true usable RERA carpet area from super built-up area and loading percentage to verify apartment value.',
    canonicalPath: '/calculators/carpet-area'
  },
  'land-area': {
    title: 'Irregular Land & 4-Sided Plot Area Calculator | IndiaTools',
    metaDescription: 'Calculate the exact square footage and cents of irregular 4-sided plots and land parcels using diagonal triangulation.',
    canonicalPath: '/calculators/land-area'
  },
  '50kb-photo': {
    title: '50KB Photo Resizer for UPSC, SSC & Govt Job Forms | IndiaTools',
    metaDescription: 'Resize and compress passport photos and signatures to under 50KB for UPSC, SSC, IBPS, and state PSC job application portals 100% privately in-browser.',
    canonicalPath: '/tools/50kb-photo'
  },
  '100kb-photo': {
    title: '100KB Photo & Document Resizer Online | IndiaTools',
    metaDescription: 'Compress photos, marksheets, and certificates to under 100KB for online government exams and college admission portals.',
    canonicalPath: '/tools/100kb-photo'
  },
  'exact-kb-compressor': {
    title: 'Exact KB Image Compressor – Target Custom File Size | IndiaTools',
    metaDescription: 'Compress JPG, PNG, and WebP images to exact target file sizes in KB (20KB, 50KB, 100KB, 200KB) privately without quality loss.',
    canonicalPath: '/tools/exact-kb-compressor'
  },
  'signature-resizer': {
    title: 'Signature Resizer (10KB–20KB) & Paper Whitener | IndiaTools',
    metaDescription: 'Resize signatures to 10KB–20KB with paper background whitening and ink contrast enhancement for Indian online examination applications.',
    canonicalPath: '/tools/signature-resizer'
  },
  'passport-photo': {
    title: 'Passport Size Photo Maker (35x45mm) & Print Sheet | IndiaTools',
    metaDescription: 'Create official Indian passport size photos (35mm x 45mm) with white background and print-ready 4x6 multi-photo sheets online.',
    canonicalPath: '/tools/passport-photo'
  },
  'image-to-pdf': {
    title: 'Image to PDF Converter Online Free (A4 PDF) | IndiaTools',
    metaDescription: 'Convert multiple JPG and PNG images into a clean single A4 PDF document directly in your browser. 100% private and client-side.',
    canonicalPath: '/tools/image-to-pdf'
  }
};

const lines = fs.readFileSync('src/data/tools.ts', 'utf8').split('\n');

let currentSlug = null;
let inSeoBlock = false;
let updatedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const slugMatch = line.match(/^\s*slug:\s*['"]([^'"]+)['"]/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }
  
  if (currentSlug && updates[currentSlug]) {
    if (line.match(/^\s*seo:\s*\{/)) {
      inSeoBlock = true;
    } else if (inSeoBlock) {
      if (line.match(/^\s*\},/)) {
        inSeoBlock = false;
        updatedCount++;
      } else if (line.match(/^\s*title:\s*/)) {
        const indent = line.match(/^(\s*)/)[1];
        lines[i] = `${indent}title: ${JSON.stringify(updates[currentSlug].title)},`;
      } else if (line.match(/^\s*metaDescription:\s*/)) {
        const indent = line.match(/^(\s*)/)[1];
        lines[i] = `${indent}metaDescription: ${JSON.stringify(updates[currentSlug].metaDescription)},`;
      } else if (line.match(/^\s*canonicalPath:\s*/)) {
        const indent = line.match(/^(\s*)/)[1];
        lines[i] = `${indent}canonicalPath: ${JSON.stringify(updates[currentSlug].canonicalPath)},`;
      }
    }
  }
}

fs.writeFileSync('src/data/tools.ts', lines.join('\n'), 'utf8');
console.log(`Successfully updated ${updatedCount} tools in src/data/tools.ts`);
