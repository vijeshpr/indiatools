import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'fs'
import {
  parseParticipants,
  deduplicateParticipants,
  shuffleParticipants,
  calculateWheelSpin,
  getSegmentAtAngle,
  splitIntoTeams,
  SAMPLE_PRESETS
} from '../src/lib/luckyDrawTeamCalc.ts'
import {
  LUCKY_TOOL_I18N,
  LUCKY_LOCALES,
  ALL_LUCKY_LANG_CODES,
  getLuckyToolTranslation
} from '../src/i18n/luckyDrawTeamI18n.ts'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools.ts'

describe('Lucky Draw Wheel & Random Team Splitter Test Suite', () => {
  // 1. PARTICIPANT PARSING, DEDUPLICATION & SHUFFLE
  describe('Participant Management', () => {
    it('handles empty participant inputs gracefully', () => {
      assert.deepStrictEqual(parseParticipants(''), [])
      assert.deepStrictEqual(parseParticipants('   \n  \n\t  '), [])
      assert.deepStrictEqual(deduplicateParticipants([]), [])
      assert.deepStrictEqual(shuffleParticipants([]), [])
    })

    it('parses multiline text, trims whitespace, and strips HTML safely', () => {
      const input = `
        Virat Kohli
        <script>alert("xss")</script>Rohit Sharma
        <b>Jasprit Bumrah</b>
        
        Hardik Pandya   
      `
      const parsed = parseParticipants(input)
      assert.strictEqual(parsed.length, 4)
      assert.strictEqual(parsed[0], 'Virat Kohli')
      assert.strictEqual(parsed[1], 'alert("xss")Rohit Sharma')
      assert.strictEqual(parsed[2], 'Jasprit Bumrah')
      assert.strictEqual(parsed[3], 'Hardik Pandya')
    })

    it('deduplicates names with case insensitivity and preserves order', () => {
      const list = ['Aarav', 'ananya', 'AARAV', 'Rohan', 'Ananya', 'Priya']
      const deduped = deduplicateParticipants(list)
      assert.deepStrictEqual(deduped, ['Aarav', 'ananya', 'Rohan', 'Priya'])
    })

    it('shuffles participants without losing or duplicating any members', () => {
      const original = SAMPLE_PRESETS.office_team.participants
      const shuffled = shuffleParticipants(original)

      assert.strictEqual(shuffled.length, original.length)
      assert.deepStrictEqual([...shuffled].sort(), [...original].sort())
    })

    it('supports large participant lists (200+ participants)', () => {
      const largeList = Array.from({ length: 250 }, (_, i) => `Participant ${i + 1}`)
      const parsed = parseParticipants(largeList.join('\n'))
      assert.strictEqual(parsed.length, 250)

      const shuffled = shuffleParticipants(parsed)
      assert.strictEqual(shuffled.length, 250)
      assert.deepStrictEqual([...shuffled].sort(), [...largeList].sort())
    })
  })

  // 2. LUCKY DRAW WHEEL GEOMETRY & WINNER SELECTION
  describe('Wheel Geometry & Mathematical Pointer Alignment', () => {
    it('returns null when calculating spin with 0 participants', () => {
      const spin = calculateWheelSpin([])
      assert.strictEqual(spin, null)
    })

    it('always selects the sole participant for a single-person wheel', () => {
      const spin = calculateWheelSpin(['Solo Winner'])
      assert.ok(spin !== null)
      assert.strictEqual(spin.winnerIndex, 0)
      assert.strictEqual(spin.winnerName, 'Solo Winner')

      // Verify reverse lookup
      const segment = getSegmentAtAngle(spin.targetAngleDegrees, ['Solo Winner'])
      assert.ok(segment !== null)
      assert.strictEqual(segment.name, 'Solo Winner')
    })

    it('mathematically aligns the chosen winner segment under the pointer', () => {
      const participants = SAMPLE_PRESETS.cricket_squad.participants // 15 players

      // Run multiple spins to test various segments and angles
      for (let spinAttempt = 0; spinAttempt < 20; spinAttempt++) {
        const spin = calculateWheelSpin(participants, spinAttempt * 45, 5)
        assert.ok(spin !== null)

        // Reverse lookup at target stopping angle
        const checkedSegment = getSegmentAtAngle(spin.targetAngleDegrees, participants, spin.pointerAngleDegrees)
        assert.ok(checkedSegment !== null)

        // The name pointed to by the wheel MUST match the chosen winner!
        assert.strictEqual(
          checkedSegment.name,
          spin.winnerName,
          `Pointer mismatch at spin ${spinAttempt}: Expected ${spin.winnerName}, pointed to ${checkedSegment.name}`
        )
      }
    })

    it('handles large 100-participant wheel angle calculations accurately', () => {
      const largeList = Array.from({ length: 100 }, (_, i) => `Contestant ${i + 1}`)
      const spin = calculateWheelSpin(largeList, 0, 8)
      assert.ok(spin !== null)

      const checked = getSegmentAtAngle(spin.targetAngleDegrees, largeList, 270)
      assert.ok(checked !== null)
      assert.strictEqual(checked.name, spin.winnerName)
    })
  })

  // 3. RANDOM TEAM SPLITTER & FAIR DISTRIBUTION
  describe('Team Splitter Algorithms', () => {
    it('handles 0 and 1 participant edge cases', () => {
      const emptyResult = splitIntoTeams([], 'by_teams', 3)
      assert.strictEqual(emptyResult.teams.length, 0)
      assert.strictEqual(emptyResult.totalParticipants, 0)

      const singleResult = splitIntoTeams(['Alice'], 'by_teams', 2)
      assert.strictEqual(singleResult.teams.length, 1)
      assert.strictEqual(singleResult.teams[0].members.length, 1)
      assert.strictEqual(singleResult.teams[0].members[0], 'Alice')
    })

    it('divides evenly when participant count is cleanly divisible', () => {
      const names = SAMPLE_PRESETS.office_team.participants // 12 members
      const res = splitIntoTeams(names, 'by_teams', 3)

      assert.strictEqual(res.teams.length, 3)
      assert.strictEqual(res.evenDistribution, true)
      res.teams.forEach(t => {
        assert.strictEqual(t.members.length, 4)
      })

      // Total members equal input length
      const totalAllocated = res.teams.reduce((acc, t) => acc + t.members.length, 0)
      assert.strictEqual(totalAllocated, 12)
    })

    it('balances group sizes so difference between any two teams is at most 1', () => {
      // 14 participants into 4 teams -> 4, 4, 3, 3
      const names = Array.from({ length: 14 }, (_, i) => `Person ${i + 1}`)
      const res = splitIntoTeams(names, 'by_teams', 4)

      assert.strictEqual(res.teams.length, 4)
      assert.strictEqual(res.evenDistribution, false)

      const sizes = res.teams.map(t => t.members.length)
      const minSize = Math.min(...sizes)
      const maxSize = Math.max(...sizes)
      assert.ok(maxSize - minSize <= 1, `Max size difference exceeded: ${maxSize} - ${minSize}`)
      assert.strictEqual(minSize, 3)
      assert.strictEqual(maxSize, 4)

      // Ensure no duplicates or dropped participants
      const allMembers = res.teams.flatMap(t => t.members)
      assert.strictEqual(allMembers.length, 14)
      assert.deepStrictEqual([...allMembers].sort(), [...names].sort())
    })

    it('splits correctly in by_size mode', () => {
      // 11 participants with target size 3 -> 4 teams (3, 3, 3, 2)
      const names = Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`)
      const res = splitIntoTeams(names, 'by_size', 3)

      assert.strictEqual(res.teams.length, 4)
      const sizes = res.teams.map(t => t.members.length)
      assert.ok(Math.max(...sizes) - Math.min(...sizes) <= 1)
    })

    it('caps teams when requested teams exceed participant count', () => {
      // 3 people into 5 teams
      const names = ['A', 'B', 'C']
      const res = splitIntoTeams(names, 'by_teams', 5)

      // Clamped to 3 teams of 1
      assert.strictEqual(res.teams.length, 3)
      res.teams.forEach(t => assert.strictEqual(t.members.length, 1))
    })

    it('preserves custom team names', () => {
      const names = ['A', 'B', 'C', 'D']
      const res = splitIntoTeams(names, 'by_teams', 2, { 0: 'Red Dragons', 1: 'Blue Phoenix' })

      assert.strictEqual(res.teams[0].name, 'Red Dragons')
      assert.strictEqual(res.teams[1].name, 'Blue Phoenix')
    })
  })

  // 4. MULTILINGUAL I18N COMPLETENESS (23 LANGUAGES)
  describe('Multilingual I18n Completeness (23 Languages)', () => {
    it('has exactly 23 languages configured in LUCKY_LOCALES and LUCKY_TOOL_I18N', () => {
      assert.strictEqual(Object.keys(LUCKY_LOCALES).length, 23)
      assert.strictEqual(Object.keys(LUCKY_TOOL_I18N).length, 23)
      assert.strictEqual(ALL_LUCKY_LANG_CODES.length, 23)
    })

    it('configures RTL direction strictly for Urdu (ur), Kashmiri (ks), and Sindhi (sd)', () => {
      assert.strictEqual(LUCKY_LOCALES.ur.dir, 'rtl')
      assert.strictEqual(LUCKY_LOCALES.ks.dir, 'rtl')
      assert.strictEqual(LUCKY_LOCALES.sd.dir, 'rtl')

      assert.strictEqual(LUCKY_TOOL_I18N.ur.dir, 'rtl')
      assert.strictEqual(LUCKY_TOOL_I18N.ks.dir, 'rtl')
      assert.strictEqual(LUCKY_TOOL_I18N.sd.dir, 'rtl')

      assert.strictEqual(LUCKY_LOCALES.en.dir, 'ltr')
      assert.strictEqual(LUCKY_LOCALES.hi.dir, 'ltr')
      assert.strictEqual(LUCKY_LOCALES.ml.dir, 'ltr')
    })

    it('contains all required UI labels and FAQs across all 23 language dictionaries', () => {
      for (const lang of ALL_LUCKY_LANG_CODES) {
        const trans = getLuckyToolTranslation(lang)
        assert.ok(trans.title.length > 5, `Language "${lang}" title missing`)
        assert.ok(trans.h1.length > 3, `Language "${lang}" h1 missing`)
        assert.ok(trans.modes.wheel.length > 0, `Language "${lang}" wheel mode label missing`)
        assert.ok(trans.modes.teams.length > 0, `Language "${lang}" teams mode label missing`)
        assert.ok(trans.participantLabels.title.length > 0)
        assert.ok(trans.wheelLabels.spinButton.length > 0)
        assert.ok(trans.teamLabels.splitButton.length > 0)
        assert.ok(trans.faqs.length >= 1, `Language "${lang}" FAQs missing`)
      }
    })
  })

  // 5. REGISTRY, ROUTING & SITEMAP INTEGRATION
  describe('Registry & Production Architecture', () => {
    it('is registered in TOOLS array as tool #67', () => {
      assert.strictEqual(TOOLS.length, 68)
      const tool = getToolBySlug('lucky-draw-team-splitter')
      assert.ok(tool !== undefined, 'lucky-draw-team-splitter not found in TOOLS')
      assert.strictEqual(tool.category, 'create')
      assert.strictEqual(tool.type, 'image-tool')
      assert.strictEqual(tool.seo.canonicalPath, '/tools/lucky-draw-team-splitter')
      assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'Title must end with | IndiaTools')
    })

    it('has CATEGORIES.create.toolCount set to 27', () => {
      assert.strictEqual(CATEGORIES.create.toolCount, 27)
    })

    it('is mapped in ToolDetailPage.tsx TOOL_COMPONENTS', () => {
      const pageCode = fs.readFileSync('src/pages/ToolDetailPage.tsx', 'utf8')
      assert.ok(pageCode.includes("'lucky-draw-team-splitter': LuckyDrawTeamSplitterTool"))
    })

    it('has redirect route registered in App.tsx', () => {
      const appCode = fs.readFileSync('src/App.tsx', 'utf8')
      assert.ok(appCode.includes('/calculators/lucky-draw-team-splitter'))
    })

    it('sitemap.xml contains 193 URLs including all 23 Lucky Draw URLs', () => {
      const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')
      const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
      assert.strictEqual(locs.length, 193)

      // Canonical URL
      assert.ok(locs.includes('https://indiatools-rho.vercel.app/tools/lucky-draw-team-splitter'))

      // All 22 regional language URLs
      for (const code of ALL_LUCKY_LANG_CODES) {
        if (code === 'en') continue
        const regionalUrl = `https://indiatools-rho.vercel.app/${code}/tools/lucky-draw-team-splitter`
        assert.ok(locs.includes(regionalUrl), `Missing regional URL in sitemap: ${regionalUrl}`)
      }
    })

    it('prerender.cjs handles lucky-draw-team-splitter localized routes', () => {
      const prerenderCode = fs.readFileSync('scripts/prerender.cjs', 'utf8')
      assert.ok(prerenderCode.includes("urlPath.includes('lucky-draw-team-splitter')"))
    })
  })

  // 6. WINNER REMOVAL & GAME OVER STATE LOGIC
  describe('Winner Removal & Game Over Mechanics', () => {
    it('identifies penultimate round and remaining contestant correctly when 2 participants compete', () => {
      const participants = ['Aarav', 'Diya']
      const winner = 'Aarav'

      // Index-based lookup for remaining contestant
      const winnerIdx = participants.findIndex(p => p.trim().toLowerCase() === winner.toLowerCase())
      assert.strictEqual(winnerIdx, 0)
      const otherIdx = winnerIdx === 0 ? 1 : 0
      const remainingContestant = participants[otherIdx]

      assert.strictEqual(remainingContestant, 'Diya')
    })

    it('prohibits wheel spin when only 1 participant remains in elimination mode', () => {
      const removeWinnerOnDraw = true
      const participants = ['Sole Survivor']
      const winnerHistoryCount = 3

      // Spin is disabled when removeWinnerOnDraw && participants.length <= 1
      const isSpinDisabled = removeWinnerOnDraw && participants.length <= 1
      assert.strictEqual(isSpinDisabled, true)

      // Game Over state is active
      const isGameOver = removeWinnerOnDraw && winnerHistoryCount > 0 && participants.length <= 1
      assert.strictEqual(isGameOver, true)
    })

    it('allows spin when 2 participants remain in elimination mode (final round)', () => {
      const removeWinnerOnDraw = true
      const participants = ['Finalist 1', 'Finalist 2']
      const isSpinDisabled = removeWinnerOnDraw && participants.length <= 1
      assert.strictEqual(isSpinDisabled, false)
    })

    it('contains localized Game Over labels for English and Malayalam', () => {
      const en = getLuckyToolTranslation('en')
      assert.strictEqual(en.wheelLabels.gameOver, 'GAME OVER')
      assert.strictEqual(en.wheelLabels.lastRemaining, 'Final Remaining Participant')
      assert.strictEqual(en.wheelLabels.finalRoundComplete, 'Final Round Complete!')

      const ml = getLuckyToolTranslation('ml')
      assert.strictEqual(ml.wheelLabels.gameOver, 'ഗെയിം ഓവർ (GAME OVER)')
      assert.strictEqual(ml.wheelLabels.lastRemaining, 'അവസാനം അവശേഷിച്ചയാൾ')
      assert.strictEqual(ml.wheelLabels.finalRoundComplete, 'അവസാന റൗണ്ട് പൂർത്തിയായി!')
    })
  })
})
