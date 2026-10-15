/**
 * Friendship & Relationship Maintenance Cost Calculator Engine
 * 100% pure client-side mathematical calculation functions
 * Safe against zero, negative, NaN, and infinity values.
 */

export type RelationshipType =
  | 'best_friend'
  | 'close_friend'
  | 'romantic_partner'
  | 'friend_group'
  | 'long_distance'
  | 'colleague'

export type Frequency =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'bimonthly'
  | 'quarterly'
  | 'biannual'
  | 'annual'
  | 'never'

export interface CustomOccasion {
  id: string
  name: string
  amount: number
}

export interface FriendshipCostInputs {
  relationshipType: RelationshipType
  relationshipDurationYears: number
  meetupFrequency: Frequency
  foodSpendPerMeetup: number
  activitySpendPerMeetup: number
  commuteSpendPerMeetup: number
  useFuelCalc: boolean
  commuteDistanceKm: number
  vehicleMileageKmpl: number
  fuelPricePerLiter: number
  birthdayGift: number
  festivalsGifts: number
  anniversaryMilestone: number
  weddingGifts: number
  casualSurprises: number
  customOccasions: CustomOccasion[]
  sharedSubscriptionsMonthly: number
  digitalDeliveriesAnnual: number
  tripsPerYear: number
  avgTripCost: number
  hoursPerMeetup: number
  travelHoursPerMeetup: number
  callHoursPerWeek: number
  messagingHoursPerDay: number
  tripDaysPerYear: number
  hourlyRate: number
}

export interface CategoryBreakdown {
  meetupsAndDining: number
  giftsAndCelebrations: number
  travelAndTrips: number
  digitalAndShared: number
}

export interface CategoryPercentages {
  meetups: number
  gifts: number
  trips: number
  digital: number
}

export interface TimeBreakdown {
  meetupHoursAnnual: number
  commuteHoursAnnual: number
  callHoursAnnual: number
  messagingHoursAnnual: number
  tripHoursAnnual: number
  totalHoursAnnual: number
  totalDaysAnnual: number
}

export interface FriendshipCostResult {
  annualCashTotal: number
  monthlyCashAvg: number
  fiveYearCashProjected: number
  categoryBreakdown: CategoryBreakdown
  categoryPercentages: CategoryPercentages
  timeBreakdown: TimeBreakdown
  opportunityCost: number
  totalValueWithTime: number
  fuelCostPerMeetup: number
  meetupsCountPerYear: number
}

export const FREQUENCY_ANNUAL_MULTIPLIERS: Record<Frequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  bimonthly: 6,
  quarterly: 4,
  biannual: 2,
  annual: 1,
  never: 0,
}

export function sanitizeNumber(value: number, min = 0, max = 100_000_000): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return min
  }
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculates fuel cost for a round-trip commute based on distance, mileage, and fuel price
 */
export function calculateCommuteFuelCost(
  distanceKm: number,
  mileageKmpl: number,
  fuelPricePerLiter: number
): number {
  const safeDist = sanitizeNumber(distanceKm)
  const safeMileage = sanitizeNumber(mileageKmpl)
  const safePrice = sanitizeNumber(fuelPricePerLiter)

  if (safeDist <= 0 || safeMileage <= 0 || safePrice <= 0) {
    return 0
  }

  const fuelLiters = safeDist / safeMileage
  const total = fuelLiters * safePrice
  return Math.round(total * 100) / 100
}

/**
 * Main calculation engine
 */
export function calculateFriendshipCost(inputs: FriendshipCostInputs): FriendshipCostResult {
  const meetupsCount = FREQUENCY_ANNUAL_MULTIPLIERS[inputs.meetupFrequency] ?? 12

  // 1. Meetup commute cost (either direct input or fuel calculator)
  let commutePerMeetup = sanitizeNumber(inputs.commuteSpendPerMeetup)
  let fuelCostPerMeetup = 0

  if (inputs.useFuelCalc) {
    fuelCostPerMeetup = calculateCommuteFuelCost(
      inputs.commuteDistanceKm,
      inputs.vehicleMileageKmpl,
      inputs.fuelPricePerLiter
    )
    commutePerMeetup = fuelCostPerMeetup
  }

  // Meetup Cash
  const foodPerMeetup = sanitizeNumber(inputs.foodSpendPerMeetup)
  const activityPerMeetup = sanitizeNumber(inputs.activitySpendPerMeetup)
  const costPerMeetup = foodPerMeetup + activityPerMeetup + commutePerMeetup
  const meetupsAndDining = Math.round(costPerMeetup * meetupsCount)

  // 2. Gifts & Celebrations
  const birthday = sanitizeNumber(inputs.birthdayGift)
  const festivals = sanitizeNumber(inputs.festivalsGifts)
  const anniversary = sanitizeNumber(inputs.anniversaryMilestone)
  const wedding = sanitizeNumber(inputs.weddingGifts)
  const surprises = sanitizeNumber(inputs.casualSurprises)

  const customTotal = (inputs.customOccasions || []).reduce((acc, curr) => {
    return acc + sanitizeNumber(curr.amount)
  }, 0)

  const giftsAndCelebrations = Math.round(
    birthday + festivals + anniversary + wedding + surprises + customTotal
  )

  // 3. Travel & Trips / Vacations
  const tripsCount = sanitizeNumber(inputs.tripsPerYear, 0, 52)
  const tripCost = sanitizeNumber(inputs.avgTripCost)
  const travelAndTrips = Math.round(tripsCount * tripCost)

  // 4. Digital Communication & Shared Subscriptions
  const sharedSubs = sanitizeNumber(inputs.sharedSubscriptionsMonthly) * 12
  const digitalDeliveries = sanitizeNumber(inputs.digitalDeliveriesAnnual)
  const digitalAndShared = Math.round(sharedSubs + digitalDeliveries)

  // Total Annual Cash
  const annualCashTotal = Math.round(
    meetupsAndDining + giftsAndCelebrations + travelAndTrips + digitalAndShared
  )
  const monthlyCashAvg = Math.round(annualCashTotal / 12)
  const fiveYearCashProjected = Math.round(annualCashTotal * 5)

  // Percentages
  const safeTotal = annualCashTotal > 0 ? annualCashTotal : 1
  const categoryPercentages: CategoryPercentages = {
    meetups: annualCashTotal > 0 ? Math.round((meetupsAndDining / safeTotal) * 100) : 0,
    gifts: annualCashTotal > 0 ? Math.round((giftsAndCelebrations / safeTotal) * 100) : 0,
    trips: annualCashTotal > 0 ? Math.round((travelAndTrips / safeTotal) * 100) : 0,
    digital: annualCashTotal > 0 ? Math.round((digitalAndShared / safeTotal) * 100) : 0,
  }

  // Ensure sum equals 100 if total > 0
  if (annualCashTotal > 0) {
    const sum =
      categoryPercentages.meetups +
      categoryPercentages.gifts +
      categoryPercentages.trips +
      categoryPercentages.digital
    if (sum !== 100) {
      categoryPercentages.meetups += 100 - sum
    }
  }

  // 5. Time Investment Calculations
  const hoursPerMeetup = sanitizeNumber(inputs.hoursPerMeetup, 0, 24)
  const travelHoursPerMeetup = sanitizeNumber(inputs.travelHoursPerMeetup, 0, 24)
  const callHoursPerWeek = sanitizeNumber(inputs.callHoursPerWeek, 0, 168)
  const messagingHoursPerDay = sanitizeNumber(inputs.messagingHoursPerDay, 0, 24)
  const tripDaysPerYear = sanitizeNumber(inputs.tripDaysPerYear, 0, 365)

  const meetupHoursAnnual = Math.round(hoursPerMeetup * meetupsCount * 10) / 10
  const commuteHoursAnnual = Math.round(travelHoursPerMeetup * meetupsCount * 10) / 10
  const callHoursAnnual = Math.round(callHoursPerWeek * 52 * 10) / 10
  const messagingHoursAnnual = Math.round(messagingHoursPerDay * 365 * 10) / 10
  const tripHoursAnnual = Math.round(tripDaysPerYear * 8 * 10) / 10 // 8 active hours per vacation day

  const totalHoursAnnual =
    Math.round(
      (meetupHoursAnnual +
        commuteHoursAnnual +
        callHoursAnnual +
        messagingHoursAnnual +
        tripHoursAnnual) *
        10
    ) / 10

  const totalDaysAnnual = Math.round((totalHoursAnnual / 24) * 10) / 10

  // 6. Opportunity Cost of Time (Clearly separate metric)
  const safeHourlyRate = sanitizeNumber(inputs.hourlyRate)
  const opportunityCost = Math.round(totalHoursAnnual * safeHourlyRate)
  const totalValueWithTime = Math.round(annualCashTotal + opportunityCost)

  return {
    annualCashTotal,
    monthlyCashAvg,
    fiveYearCashProjected,
    categoryBreakdown: {
      meetupsAndDining,
      giftsAndCelebrations,
      travelAndTrips,
      digitalAndShared,
    },
    categoryPercentages,
    timeBreakdown: {
      meetupHoursAnnual,
      commuteHoursAnnual,
      callHoursAnnual,
      messagingHoursAnnual,
      tripHoursAnnual,
      totalHoursAnnual,
      totalDaysAnnual,
    },
    opportunityCost,
    totalValueWithTime,
    fuelCostPerMeetup,
    meetupsCountPerYear: meetupsCount,
  }
}

export interface PresetProfile {
  id: string
  name: string
  description: string
  inputs: FriendshipCostInputs
}

export const PRESET_PROFILES: Record<string, PresetProfile> = {
  college_besties: {
    id: 'college_besties',
    name: 'College Best Friends',
    description: 'Frequent pocket-friendly cafe hangouts, shared food treats, and road trips.',
    inputs: {
      relationshipType: 'best_friend',
      relationshipDurationYears: 3,
      meetupFrequency: 'weekly',
      foodSpendPerMeetup: 250,
      activitySpendPerMeetup: 100,
      commuteSpendPerMeetup: 60,
      useFuelCalc: false,
      commuteDistanceKm: 15,
      vehicleMileageKmpl: 45,
      fuelPricePerLiter: 102,
      birthdayGift: 1200,
      festivalsGifts: 500,
      anniversaryMilestone: 0,
      weddingGifts: 0,
      casualSurprises: 500,
      customOccasions: [],
      sharedSubscriptionsMonthly: 80,
      digitalDeliveriesAnnual: 1000,
      tripsPerYear: 1,
      avgTripCost: 4500,
      hoursPerMeetup: 3.5,
      travelHoursPerMeetup: 1.0,
      callHoursPerWeek: 1.5,
      messagingHoursPerDay: 0.5,
      tripDaysPerYear: 3,
      hourlyRate: 0,
    },
  },
  romantic_dating: {
    id: 'romantic_dating',
    name: 'Dating & Romantic Partner',
    description: 'Weekly weekend dates, milestone anniversaries, surprise dinners, and trips.',
    inputs: {
      relationshipType: 'romantic_partner',
      relationshipDurationYears: 2,
      meetupFrequency: 'weekly',
      foodSpendPerMeetup: 1500,
      activitySpendPerMeetup: 700,
      commuteSpendPerMeetup: 250,
      useFuelCalc: false,
      commuteDistanceKm: 25,
      vehicleMileageKmpl: 15,
      fuelPricePerLiter: 102,
      birthdayGift: 4000,
      festivalsGifts: 2500,
      anniversaryMilestone: 3500,
      weddingGifts: 0,
      casualSurprises: 3000,
      customOccasions: [],
      sharedSubscriptionsMonthly: 350,
      digitalDeliveriesAnnual: 3500,
      tripsPerYear: 2,
      avgTripCost: 16000,
      hoursPerMeetup: 5.0,
      travelHoursPerMeetup: 1.5,
      callHoursPerWeek: 6.0,
      messagingHoursPerDay: 1.5,
      tripDaysPerYear: 6,
      hourlyRate: 500,
    },
  },
  long_distance: {
    id: 'long_distance',
    name: 'Long-Distance Friendship',
    description: 'Infrequent in-person reunions with high travel/stay costs, lots of phone calls.',
    inputs: {
      relationshipType: 'long_distance',
      relationshipDurationYears: 5,
      meetupFrequency: 'quarterly',
      foodSpendPerMeetup: 2000,
      activitySpendPerMeetup: 1200,
      commuteSpendPerMeetup: 3500,
      useFuelCalc: false,
      commuteDistanceKm: 250,
      vehicleMileageKmpl: 18,
      fuelPricePerLiter: 102,
      birthdayGift: 2500,
      festivalsGifts: 1500,
      anniversaryMilestone: 0,
      weddingGifts: 2500,
      casualSurprises: 1500,
      customOccasions: [],
      sharedSubscriptionsMonthly: 150,
      digitalDeliveriesAnnual: 2000,
      tripsPerYear: 1,
      avgTripCost: 12000,
      hoursPerMeetup: 8.0,
      travelHoursPerMeetup: 6.0,
      callHoursPerWeek: 3.5,
      messagingHoursPerDay: 0.8,
      tripDaysPerYear: 4,
      hourlyRate: 400,
    },
  },
  friend_group: {
    id: 'friend_group',
    name: 'Close Friend Group / Gang',
    description: 'Bi-weekly dinners, split sports/movies, birthday gift pools, and annual retreat.',
    inputs: {
      relationshipType: 'friend_group',
      relationshipDurationYears: 4,
      meetupFrequency: 'biweekly',
      foodSpendPerMeetup: 650,
      activitySpendPerMeetup: 350,
      commuteSpendPerMeetup: 120,
      useFuelCalc: false,
      commuteDistanceKm: 18,
      vehicleMileageKmpl: 35,
      fuelPricePerLiter: 102,
      birthdayGift: 1500,
      festivalsGifts: 1000,
      anniversaryMilestone: 0,
      weddingGifts: 2000,
      casualSurprises: 800,
      customOccasions: [],
      sharedSubscriptionsMonthly: 100,
      digitalDeliveriesAnnual: 1200,
      tripsPerYear: 1,
      avgTripCost: 7500,
      hoursPerMeetup: 4.0,
      travelHoursPerMeetup: 1.0,
      callHoursPerWeek: 1.0,
      messagingHoursPerDay: 0.6,
      tripDaysPerYear: 3,
      hourlyRate: 350,
    },
  },
  colleague: {
    id: 'colleague',
    name: 'Work Colleague / Office Pal',
    description: 'Workday lunches, monthly tea breaks, farewell/promotion treats.',
    inputs: {
      relationshipType: 'colleague',
      relationshipDurationYears: 1,
      meetupFrequency: 'monthly',
      foodSpendPerMeetup: 450,
      activitySpendPerMeetup: 100,
      commuteSpendPerMeetup: 50,
      useFuelCalc: false,
      commuteDistanceKm: 10,
      vehicleMileageKmpl: 40,
      fuelPricePerLiter: 102,
      birthdayGift: 600,
      festivalsGifts: 500,
      anniversaryMilestone: 0,
      weddingGifts: 1000,
      casualSurprises: 400,
      customOccasions: [],
      sharedSubscriptionsMonthly: 0,
      digitalDeliveriesAnnual: 500,
      tripsPerYear: 0,
      avgTripCost: 0,
      hoursPerMeetup: 2.0,
      travelHoursPerMeetup: 0.5,
      callHoursPerWeek: 0.5,
      messagingHoursPerDay: 0.2,
      tripDaysPerYear: 0,
      hourlyRate: 300,
    },
  },
}
